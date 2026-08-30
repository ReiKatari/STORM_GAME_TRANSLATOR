(function() {
    if (window.hasImmersiveTranslateInjected) return;
    window.hasImmersiveTranslateInjected = true;

    const MARK_ATTR = "data-translationmark";
    const ORIG_DISPLAY_ATTR = "data-translationoriginaldisplay";
    const PENDING_CLASS = "immersive-translate-pending";

    // 匹配 CJK 字符（中文/日文假名/汉字扩展/韩文），用于判断译文是否为 CJK 目标语言。
    // CJK 字体没有真正的 italic 字形，浏览器机械倾斜结果较丑，应跳过 italic。
    const CJK_REGEX = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af\uf900-\ufaff\uff66-\uff9f]/;

    // Default to true, will be controlled by Native side calling setBilingualMode
    window.isBilingual = true; 
    let translationCallbacks = {};

    // Inject shimmer animation + translation underline styles once
    (function injectStyles() {
        if (document.getElementById("immersive-translate-style")) return;
        const style = document.createElement("style");
        style.id = "immersive-translate-style";
        style.textContent = `
            @keyframes immersiveTranslatePulse {
                0%, 100% { opacity: 1; }
                50%      { opacity: 0.4; }
            }
            .${PENDING_CLASS} {
                animation: immersiveTranslatePulse 1.6s ease-in-out infinite;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    })();

    // 1. 获取所有待翻译的块级文本节点
    function getNodesToTranslate(root = document.body) {
        const ignoreTags = ['TITLE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'SVG', 'CODE', 'PRE', 'NOSCRIPT', 'IFRAME', 'BUTTON', 'INPUT', 'SELECT'];
        const blockTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'SPAN', 'DIV', 'TD', 'ARTICLE', 'SECTION'];
        let resultNodes = [];

        function traverse(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const nodeName = node.nodeName.toUpperCase();
                if (ignoreTags.includes(nodeName) || 
                    node.getAttribute(MARK_ATTR) === "copiedNode" || 
                    node.classList.contains("notranslate") || 
                    node.getAttribute("translate") === "no" ||
                    node.isContentEditable) {
                    return;
                }
                
                if (blockTags.includes(nodeName)) {
                    let hasDirectText = false;
                    for (let child of node.childNodes) {
                        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 10) {
                            hasDirectText = true;
                            break;
                        }
                    }
                    if (hasDirectText && !resultNodes.includes(node)) {
                        resultNodes.push(node);
                        return; // 找到直接文本的块节点，不再深入其子节点
                    }
                }

                for (let child of node.childNodes) {
                    traverse(child);
                }
            }
        }
        traverse(root);
        return resultNodes;
    }

    // 2. 双语 DOM 的预处理：克隆原文（先隐藏），并让原节点闪烁提示正在翻译
    function prepareBilingualDOM(node) {
        if (node.hasAttribute && node.hasAttribute(MARK_ATTR)) return null;

        // 克隆原始节点作为“原文对照”，但在翻译完成前始终隐藏
        const copyNode = node.cloneNode(true);
        copyNode.setAttribute(MARK_ATTR, "copiedNode");
        copyNode.setAttribute(ORIG_DISPLAY_ATTR, node.style.display || "");
        copyNode.classList.add("notranslate");
        copyNode.style.display = "none";

        // 插入到原节点之前
        node.parentNode.insertBefore(copyNode, node);
        node.setAttribute(MARK_ATTR, "translatedNode");

        // 让原节点轻微闪烁，提示用户该段即将被翻译
        node.classList.add(PENDING_CLASS);

        return copyNode;
    }

    // 3. 判断节点是否在当前屏幕（视口）可见
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    // 4. 原生端翻译完成后的回调函数
    window.onTranslationComplete = function(callbackId, translatedTexts) {
        const callbackData = translationCallbacks[callbackId];
        if (!callbackData) return;

        const { nodes, copyNodes } = callbackData;
        nodes.forEach((node, index) => {
            const translatedText = translatedTexts[index];
            if (translatedText) {
                // 停止闪烁
                node.classList.remove(PENDING_CLASS);

                // 1. 根据当前模式决定是否应用样式包裹
                //    - 使用 CSS text-decoration 画虚线，可在每个换行末尾正确绘制（替代旧的 background-image 方案，
                //      旧方案对 block 元素只在最后一行底部画一条线）。
                //    - CJK（中/日/韩）目标语言机械倾斜很难看，仅对非 CJK 译文应用 italic。
                const isCJK = CJK_REGEX.test(translatedText);
                const dashedUnderline = "text-decoration: underline; text-decoration-style: dashed; text-decoration-color: #1976D2; text-decoration-thickness: 1px; text-underline-offset: 0.25em;";
                const italicStyle = isCJK ? "font-style: normal;" : "font-style: italic;";
                const fontStyle = window.isBilingual
                    ? `opacity: 0.7; display: block; padding-top: 4px; ${italicStyle} ${dashedUnderline}`
                    : "opacity: 1; display: block; padding-top: 4px; font-style: normal;";

                node.innerHTML = `<font class="immersive-translate-styled" style="${fontStyle}">${translatedText}</font>`;
                
                // 2. 根据当前的模式显示或隐藏原始文本的克隆体
                const copyNode = copyNodes[index];
                if (window.isBilingual) {
                    const originalDisplay = copyNode.getAttribute(ORIG_DISPLAY_ATTR);
                    if (originalDisplay) {
                        copyNode.style.display = originalDisplay;
                    } else {
                        copyNode.style.removeProperty("display");
                    }
                } else {
                    copyNode.style.display = "none";
                }
            } else {
                // 翻译失败也要停止闪烁
                node.classList.remove(PENDING_CLASS);
            }
        });

        // 释放缓存
        delete translationCallbacks[callbackId];
    };

    // 5. 切换双语模式 / 替换模式 (供原生端调用)
    window.setBilingualMode = function(isBilingual) {
        window.isBilingual = isBilingual;

        // A. 控制所有克隆原文节点的显示与隐藏
        const copyNodes = document.querySelectorAll(`[${MARK_ATTR}="copiedNode"]`);
        copyNodes.forEach(copyNode => {
            if (isBilingual) {
                const originalDisplay = copyNode.getAttribute(ORIG_DISPLAY_ATTR);
                if (originalDisplay) {
                    copyNode.style.display = originalDisplay;
                } else {
                    copyNode.style.removeProperty("display");
                }
            } else {
                copyNode.style.display = "none";
            }
        });

        // B. 控制已翻译字体的样式（弱化灰色/下划线 或 正常显示）
        const styledFonts = document.querySelectorAll('font.immersive-translate-styled');
        styledFonts.forEach(font => {
            if (isBilingual) {
                const isCJK = CJK_REGEX.test(font.textContent || "");
                font.style.opacity = "0.7";
                font.style.fontStyle = isCJK ? "normal" : "italic";
                // 清除旧版 background-image 虚线方案的残留样式
                font.style.backgroundImage = "none";
                font.style.paddingBottom = "0";
                // 使用 text-decoration 虚线，对多行文本每行末尾都生效
                font.style.textDecorationLine = "underline";
                font.style.textDecorationStyle = "dashed";
                font.style.textDecorationColor = "#1976D2";
                font.style.textDecorationThickness = "1px";
                font.style.textUnderlineOffset = "0.25em";
            } else {
                font.style.opacity = "1";
                font.style.fontStyle = "normal";
                font.style.backgroundImage = "none";
                font.style.paddingBottom = "0";
                font.style.textDecorationLine = "none";
            }
        });
    };

    // 6. 动态检测并分批翻译视口内可见文本
    let isTranslating = false;
    function performTranslationLoop() {
        if (isTranslating) return;
        isTranslating = true;

        try {
            const allNodes = getNodesToTranslate();
            let visibleNodes = [];
            let visibleCopyNodes = [];
            let textsToTranslate = [];

            allNodes.forEach(node => {
                if (node.getAttribute(MARK_ATTR) !== "translatedNode" && isElementInViewport(node)) {
                    const copyNode = prepareBilingualDOM(node);
                    if (copyNode) {
                        visibleNodes.push(node);
                        visibleCopyNodes.push(copyNode);
                        textsToTranslate.push(node.innerText || node.textContent);
                    }
                }
            });

            if (textsToTranslate.length > 0) {
                const callbackId = "cb_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
                
                translationCallbacks[callbackId] = {
                    nodes: visibleNodes,
                    copyNodes: visibleCopyNodes
                };

                // 通过 JSBridge 调用 Android 原生接口进行翻译
                if (window.AndroidBridge && window.AndroidBridge.translate) {
                    window.AndroidBridge.translate(JSON.stringify(textsToTranslate), callbackId);
                }
            }
        } catch (e) {
            console.error("Translation loop error: ", e);
        } finally {
            isTranslating = false;
        }
    }

    // 7. 开启滚动防抖轮询和 DOM 监听
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(performTranslationLoop, 200);
    });
    
    // 使用 MutationObserver 监听动态内容变化（无限滚动/SPA）
    const observer = new MutationObserver(() => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(performTranslationLoop, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 首次载入延时触发
    setTimeout(performTranslationLoop, 1500);
})();
