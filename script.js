(() => {
  'use strict';

  const INSTANCE_KEY = '__image_devtools_protection_installed__';

  if (window[INSTANCE_KEY]) return;

  try {
    Object.defineProperty(window, INSTANCE_KEY, {
      value: true,
      configurable: false
    });
  } catch (_) {
    window[INSTANCE_KEY] = true;
  }

  /* ========================================================================
   * CONFIG
   * ========================================================================
   *
   * PROTECTION_LEVEL:
   *
   * 0 - No restrictions at all.
   *
   * 1 - Basic restrictions:
   *     disables interactions with images/media, blocks media context menu,
   *     drag, select, copy/cut on protected media elements.
   *
   * 2 - Serious restrictions:
   *     level 1 + DevTools protection with redirect to google.com.
   *
   * 3 - Aggressive restrictions:
   *     level 2 + faster checks, lower thresholds, less waiting,
   *     blocks Ctrl+S / Cmd+S, Ctrl+P / Cmd+P, page source shortcuts,
   *     adds stricter media/touch/download protection and print hiding.
   *
   * 4 - Maximum browser-level restrictions:
   *     level 3 + fullscreen blur on unfocus/visibility loss,
   *     early screenshot shortcut blur for Win+Shift and Cmd+Option+Shift,
   *     screenshot shortcut blocking where the browser allows it.
   */

  // Recommended and safest - level 2
  // Also level 3 is safe and works much better, must test yourself
  const PROTECTION_LEVEL = 3;

  const LEVEL = Math.max(0, Math.min(4, Math.trunc(Number(PROTECTION_LEVEL) || 0)));

  const PROFILES = [
    {
      imgCss: false,
      mediaContext: false,
      mediaDrag: false,
      mediaPointerBlock: false,
      mediaTouchBlock: false,
      downloadLinkBlock: false,
      inlineBackgroundBlock: false,
      devtools: false,
      sizeCheck: false,
      keybinds: false,
      redirectOnDevtoolsShortcut: false,
      globalContext: false,
      debuggerTiming: false,
      debuggerLoop: false,
      consoleBait: false,
      eventLoopLag: false,
      selfHealingStyle: false,
      decoys: false,
      blurOnFocusLoss: false,
      screenshotProtection: false,
      earlyWindowsSnipBlur: false,
      earlyMacOptionScreenshotBlur: false,
      earlyMacCmdShiftBlur: false,
      saveBlock: false,
      printBlock: false,
      printCssBlock: false,
      redirectUrl: 'https://www.google.com/',
      startupGrace: 0,
      sizeWidthThreshold: 9999,
      sizeHeightThreshold: 9999,
      sizeInterval: 1000,
      sizeHits: 9999,
      debuggerInterval: 1000,
      debuggerThreshold: 9999,
      debuggerHits: 9999,
      eventLoopInterval: 1000,
      eventLoopThreshold: 9999,
      eventLoopHits: 9999
    },
    {
      imgCss: true,
      mediaContext: true,
      mediaDrag: true,
      mediaPointerBlock: false,
      mediaTouchBlock: false,
      downloadLinkBlock: false,
      inlineBackgroundBlock: false,
      devtools: false,
      sizeCheck: false,
      keybinds: false,
      redirectOnDevtoolsShortcut: false,
      globalContext: false,
      debuggerTiming: false,
      debuggerLoop: false,
      consoleBait: false,
      eventLoopLag: false,
      selfHealingStyle: true,
      decoys: false,
      blurOnFocusLoss: false,
      screenshotProtection: false,
      earlyWindowsSnipBlur: false,
      earlyMacOptionScreenshotBlur: false,
      earlyMacCmdShiftBlur: false,
      saveBlock: false,
      printBlock: false,
      printCssBlock: false,
      redirectUrl: 'https://www.google.com/',
      startupGrace: 0,
      sizeWidthThreshold: 9999,
      sizeHeightThreshold: 9999,
      sizeInterval: 1000,
      sizeHits: 9999,
      debuggerInterval: 1000,
      debuggerThreshold: 9999,
      debuggerHits: 9999,
      eventLoopInterval: 1000,
      eventLoopThreshold: 9999,
      eventLoopHits: 9999
    },
    {
      imgCss: true,
      mediaContext: true,
      mediaDrag: true,
      mediaPointerBlock: false,
      mediaTouchBlock: false,
      downloadLinkBlock: false,
      inlineBackgroundBlock: false,
      devtools: true,
      sizeCheck: true,
      keybinds: true,
      redirectOnDevtoolsShortcut: false,
      globalContext: false,
      debuggerTiming: true,
      debuggerLoop: false,
      consoleBait: false,
      eventLoopLag: true,
      selfHealingStyle: true,
      decoys: true,
      blurOnFocusLoss: false,
      screenshotProtection: false,
      earlyWindowsSnipBlur: false,
      earlyMacOptionScreenshotBlur: false,
      earlyMacCmdShiftBlur: false,
      saveBlock: false,
      printBlock: false,
      printCssBlock: false,
      redirectUrl: 'https://www.google.com/',
      startupGrace: 500,
      sizeWidthThreshold: 180,
      sizeHeightThreshold: 240,
      sizeInterval: 600,
      sizeHits: 2,
      debuggerInterval: 900,
      debuggerThreshold: 120,
      debuggerHits: 1,
      eventLoopInterval: 800,
      eventLoopThreshold: 1200,
      eventLoopHits: 2
    },
    {
      imgCss: true,
      mediaContext: true,
      mediaDrag: true,
      mediaPointerBlock: true,
      mediaTouchBlock: true,
      downloadLinkBlock: true,
      inlineBackgroundBlock: true,
      devtools: true,
      sizeCheck: true,
      keybinds: true,
      redirectOnDevtoolsShortcut: true,
      globalContext: false,
      debuggerTiming: true,
      debuggerLoop: false,
      consoleBait: true,
      eventLoopLag: true,
      selfHealingStyle: true,
      decoys: true,
      blurOnFocusLoss: false,
      screenshotProtection: false,
      earlyWindowsSnipBlur: false,
      earlyMacOptionScreenshotBlur: false,
      earlyMacCmdShiftBlur: false,
      saveBlock: true,
      printBlock: true,
      printCssBlock: true,
      redirectUrl: 'https://www.google.com/',
      startupGrace: 150,
      sizeWidthThreshold: 110,
      sizeHeightThreshold: 150,
      sizeInterval: 220,
      sizeHits: 1,
      debuggerInterval: 350,
      debuggerThreshold: 80,
      debuggerHits: 1,
      eventLoopInterval: 350,
      eventLoopThreshold: 550,
      eventLoopHits: 1
    },
    {
      imgCss: true,
      mediaContext: true,
      mediaDrag: true,
      mediaPointerBlock: true,
      mediaTouchBlock: true,
      downloadLinkBlock: true,
      inlineBackgroundBlock: true,
      devtools: true,
      sizeCheck: true,
      keybinds: true,
      redirectOnDevtoolsShortcut: true,
      globalContext: false,
      debuggerTiming: true,
      debuggerLoop: false,
      consoleBait: true,
      eventLoopLag: true,
      selfHealingStyle: true,
      decoys: true,
      blurOnFocusLoss: true,
      screenshotProtection: true,
      earlyWindowsSnipBlur: true,
      earlyMacOptionScreenshotBlur: true,
      earlyMacCmdShiftBlur: false,
      saveBlock: true,
      printBlock: true,
      printCssBlock: true,
      redirectUrl: 'https://www.google.com/',
      startupGrace: 150,
      sizeWidthThreshold: 110,
      sizeHeightThreshold: 150,
      sizeInterval: 220,
      sizeHits: 1,
      debuggerInterval: 350,
      debuggerThreshold: 80,
      debuggerHits: 1,
      eventLoopInterval: 350,
      eventLoopThreshold: 550,
      eventLoopHits: 1
    }
  ];

  const O = PROFILES[LEVEL];

  const IMG_STYLE_ID = 'anti-img-interaction-style';
  const PRINT_STYLE_ID = 'anti-media-print-style';
  const MEDIA_SELECTOR = 'img,video,audio,picture,source,canvas,svg,image,object,embed';
  const MEDIA_ATTR_SELECTOR = 'img,video,audio,canvas,svg,object,embed';
  const IMG_SELECTOR = 'img,picture img,svg image';
  const INLINE_BACKGROUND_SELECTOR = '[style*="background-image"],[style*="url("]';
  const MEDIA_LINK_SELECTOR = 'a[href],area[href]';
  const DEVTOOLS_ACTION = 'redirect';
  const IGNORE_CHECKS_WHEN_TAB_HIDDEN = true;
  const CONSOLE_BAIT_INTERVAL = 1500;
  const CONSOLE_BAIT_HITS = 1;
  const FULL_SCREEN_BLUR_ID = 'full-screen-privacy-blur';
  const FULL_SCREEN_BLUR_AMOUNT = 28;
  const FULL_SCREEN_BLUR_BG = 'rgba(255,255,255,0.18)';
  const FULL_SCREEN_BLUR_Z = 2147483647;
  const FULL_SCREEN_BLUR_MIN_DURATION = 450;
  const FULL_SCREEN_BLUR_HIDE_DELAY = 120;
  const SCREENSHOT_BLUR_HOLD = 1800;
  const EARLY_SCREENSHOT_RELEASE_DELAY = 250;
  const BACKGROUND_LOOKUP_DEPTH = 5;
  const DEVTOOLS_RESUME_COOLDOWN = 1200;
  const MEDIA_URL_RE = /\.(?:apng|avif|bmp|gif|ico|jpe?g|png|svg|webp|mp4|webm|mov|m4v)(?:[?#].*)?$/i;
  const PRINT_MEDIA_SELECTOR = O.inlineBackgroundBlock ? `${MEDIA_SELECTOR},${INLINE_BACKGROUND_SELECTOR}` : MEDIA_SELECTOR;
  const IMG_CSS = [
    `${IMG_SELECTOR}{pointer-events:none!important;-webkit-user-drag:none!important;user-drag:none!important;-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important;touch-action:none!important}`,
    `${MEDIA_SELECTOR}{-webkit-user-drag:none!important;user-drag:none!important;-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important}`,
    O.inlineBackgroundBlock ? `${INLINE_BACKGROUND_SELECTOR}{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important}` : ''
  ].join('');
  const PRINT_CSS = `@media print{${PRINT_MEDIA_SELECTOR}{display:none!important;visibility:hidden!important;opacity:0!important}html:after{content:"";position:fixed;inset:0;background:#fff!important;z-index:2147483647!important;pointer-events:none!important}}`;

  if (LEVEL <= 0) return;

  const startedAt = performance.now();
  const pressedKeys = new Set();

  let handled = false;
  let sizeHits = 0;
  let debuggerHits = 0;
  let eventLoopHits = 0;
  let consoleBaitHits = 0;
  let lastEventLoopTick = performance.now();
  let devtoolsChecksPausedUntil = startedAt + O.startupGrace;
  let blurOverlay = null;
  let blurShownAt = 0;
  let blurHideTimer = 0;
  let earlyScreenshotBlurActive = false;

  const platformText = `${navigator.platform || ''} ${navigator.userAgent || ''}`.toLowerCase();
  const isApplePlatform = /mac|iphone|ipad|ipod/.test(platformText);
  const isWindowsPlatform = /win/.test(platformText);

  const isAfterGracePeriod = () => performance.now() - startedAt >= O.startupGrace;
  const isHidden = () => IGNORE_CHECKS_WHEN_TAB_HIDDEN && document.hidden;
  const areDevtoolsChecksPaused = () => performance.now() < devtoolsChecksPausedUntil;
  const canRunDevtoolsChecks = () => isAfterGracePeriod() && !isHidden() && !areDevtoolsChecksPaused();
  const normalizeUrl = (url) => /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  const appendToDocument = (node) => {
    const parent = document.head || document.documentElement;
    if (parent) parent.appendChild(node);
  };

  const closest = (target, selector) => {
    if (!target) return null;
    let node = target.nodeType === Node.ELEMENT_NODE ? target : target.parentElement;
    return node && typeof node.closest === 'function' ? node.closest(selector) : null;
  };

  const collectElements = (root, selector) => {
    const elements = [];

    if (!root) return elements;

    if (root.nodeType === Node.ELEMENT_NODE && root.matches && root.matches(selector)) {
      elements.push(root);
    }

    if (root.querySelectorAll) {
      root.querySelectorAll(selector).forEach((el) => elements.push(el));
    }

    return elements;
  };

  const isLikelyMediaUrl = (href) => {
    if (!href) return false;

    const value = String(href).trim();

    return (
      /^data:(?:image|video)\//i.test(value) ||
      /^blob:/i.test(value) ||
      MEDIA_URL_RE.test(value)
    );
  };

  const hasProtectedBackground = (node) => {
    if (!O.inlineBackgroundBlock || !node || node.nodeType !== Node.ELEMENT_NODE) return false;

    if (node.matches && node.matches(INLINE_BACKGROUND_SELECTOR)) return true;

    try {
      const background = window.getComputedStyle(node).backgroundImage;
      return Boolean(background && background !== 'none' && /url\(/i.test(background));
    } catch (_) {
      return false;
    }
  };

  const closestProtectedMedia = (target, includeBackground = false) => {
    if (!target) return null;

    let node = target.nodeType === Node.ELEMENT_NODE ? target : target.parentElement;
    let depth = 0;

    while (node && node.nodeType === Node.ELEMENT_NODE && depth <= BACKGROUND_LOOKUP_DEPTH) {
      if (node.matches && node.matches(MEDIA_SELECTOR)) return node;
      if (includeBackground && hasProtectedBackground(node)) return node;

      node = node.parentElement;
      depth += 1;
    }

    return null;
  };

  const getMediaAnchor = (target) => {
    const anchor = closest(target, MEDIA_LINK_SELECTOR);

    if (!anchor) return null;

    const href = anchor.getAttribute('href') || '';
    const containsMedia = Boolean(anchor.querySelector && anchor.querySelector(MEDIA_SELECTOR));
    const pointsToMedia = isLikelyMediaUrl(href);

    return containsMedia || pointsToMedia || anchor.hasAttribute('download') ? anchor : null;
  };

  const isProtectedDownloadAnchor = (anchor) => {
    if (!O.downloadLinkBlock || !anchor) return false;

    const href = anchor.getAttribute('href') || '';
    const containsMedia = Boolean(anchor.querySelector && anchor.querySelector(MEDIA_SELECTOR));
    const pointsToMedia = isLikelyMediaUrl(href);

    return (
      pointsToMedia ||
      (anchor.hasAttribute('download') && containsMedia)
    );
  };

  const selectionContainsMedia = () => {
    if (!window.getSelection) return false;

    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) return false;

    for (let index = 0; index < selection.rangeCount; index += 1) {
      const range = selection.getRangeAt(index);
      const root = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement;

      if (!root) continue;

      const candidates = collectElements(root, MEDIA_SELECTOR);

      for (const candidate of candidates) {
        try {
          if (typeof range.intersectsNode === 'function' && range.intersectsNode(candidate)) {
            return true;
          }
        } catch (_) {}
      }
    }

    return false;
  };

  const key = (event) => String(event.key || '').toLowerCase();
  const code = (event) => String(event.code || '').toLowerCase();

  const stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    return false;
  };

  const emit = (reason, extra = {}) => {
    try {
      document.dispatchEvent(new CustomEvent('devtools-detected', {
        detail: {
          reason,
          extra,
          href: location.href,
          at: new Date().toISOString(),
          level: LEVEL
        }
      }));
    } catch (_) {}
  };

  const blockOverlay = (reason) => {
    const el = document.createElement('div');
    el.setAttribute('data-devtools-block-overlay', 'true');
    el.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:#fff;color:#111;font:16px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:center;padding:24px';
    el.textContent = `Access blocked. Reason: ${reason}`;
    document.documentElement.appendChild(el);
  };

  const detected = (reason, extra = {}) => {
    if (!O.devtools || handled) return;

    handled = true;
    emit(reason, extra);

    if (DEVTOOLS_ACTION === 'redirect') {
      location.replace(normalizeUrl(O.redirectUrl));
      return;
    }

    if (DEVTOOLS_ACTION === 'blank') {
      document.documentElement.innerHTML = '';
      return;
    }

    if (DEVTOOLS_ACTION === 'overlay') {
      blockOverlay(reason);
      return;
    }

    if (DEVTOOLS_ACTION === 'reload') {
      location.reload();
      return;
    }

    handled = false;
  };

  const resetDevtoolsHits = () => {
    sizeHits = 0;
    debuggerHits = 0;
    eventLoopHits = 0;
    consoleBaitHits = 0;
    lastEventLoopTick = performance.now();
  };

  const pauseDevtoolsChecks = (duration = DEVTOOLS_RESUME_COOLDOWN) => {
    if (!O.devtools) return;

    devtoolsChecksPausedUntil = Math.max(devtoolsChecksPausedUntil, performance.now() + duration);
    resetDevtoolsHits();
  };

  const skipDevtoolsCheck = () => {
    if (canRunDevtoolsChecks()) return false;

    resetDevtoolsHits();
    return true;
  };

  const installDevtoolsLifecycleGuard = () => {
    if (!O.devtools) return;

    window.addEventListener('blur', () => pauseDevtoolsChecks(), true);
    window.addEventListener('focus', () => pauseDevtoolsChecks(), true);
    window.addEventListener('pageshow', () => pauseDevtoolsChecks(), true);
    window.addEventListener('pagehide', () => pauseDevtoolsChecks(), true);
    document.addEventListener('freeze', () => pauseDevtoolsChecks(), true);
    document.addEventListener('resume', () => pauseDevtoolsChecks(), true);

    document.addEventListener('visibilitychange', () => {
      pauseDevtoolsChecks();
    }, true);
  };

  const injectImgCss = () => {
    if (!O.imgCss) return;

    let style = document.getElementById(IMG_STYLE_ID);

    if (!style) {
      style = document.createElement('style');
      style.id = IMG_STYLE_ID;
      appendToDocument(style);
    }

    if (style.disabled) style.disabled = false;
    if (style.textContent !== IMG_CSS) style.textContent = IMG_CSS;
  };

  const injectPrintCss = () => {
    if (!O.printBlock || !O.printCssBlock) return;

    let style = document.getElementById(PRINT_STYLE_ID);

    if (!style) {
      style = document.createElement('style');
      style.id = PRINT_STYLE_ID;
      appendToDocument(style);
    }

    if (style.disabled) style.disabled = false;
    if (style.textContent !== PRINT_CSS) style.textContent = PRINT_CSS;
  };

  const protectMediaAttrs = (root = document) => {
    if (!O.mediaDrag) return;

    collectElements(root, MEDIA_ATTR_SELECTOR).forEach((el) => {
      try {
        if (el.getAttribute('draggable') !== 'false') el.setAttribute('draggable', 'false');
        if (el.draggable !== false) el.draggable = false;
      } catch (_) {}

      if (/^(video|audio)$/i.test(el.tagName)) {
        try {
          if (el.controlsList && typeof el.controlsList.add === 'function') {
            ['nodownload', 'noremoteplayback', 'noplaybackrate'].forEach((token) => el.controlsList.add(token));
          } else if (!/\bnodownload\b/i.test(el.getAttribute('controlslist') || '')) {
            el.setAttribute('controlsList', 'nodownload noremoteplayback noplaybackrate');
          }
        } catch (_) {
          try {
            el.setAttribute('controlsList', 'nodownload noremoteplayback noplaybackrate');
          } catch (__) {}
        }

        try {
          el.disableRemotePlayback = true;
          el.setAttribute('disableremoteplayback', '');
        } catch (_) {}
      }

      if (/^video$/i.test(el.tagName)) {
        try {
          el.disablePictureInPicture = true;
          el.setAttribute('disablepictureinpicture', '');
        } catch (_) {}
      }
    });
  };

  const protectDownloadLinks = (root = document) => {
    if (!O.downloadLinkBlock) return;

    collectElements(root, MEDIA_LINK_SELECTOR).forEach((anchor) => {
      if (!isProtectedDownloadAnchor(anchor)) return;

      try {
        if (anchor.hasAttribute('download')) anchor.removeAttribute('download');
      } catch (_) {}

      try {
        const rel = new Set(String(anchor.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
        rel.add('noopener');
        rel.add('noreferrer');
        anchor.setAttribute('rel', Array.from(rel).join(' '));
      } catch (_) {}
    });
  };

  const hasProtectedEventTarget = (event, includeBackground = false) => {
    if (closestProtectedMedia(event.target, includeBackground)) return true;

    const anchor = getMediaAnchor(event.target);
    return Boolean(anchor && isProtectedDownloadAnchor(anchor));
  };

  const installMediaBlockers = () => {
    if (O.mediaContext) {
      document.addEventListener('contextmenu', (event) => {
        if (closestProtectedMedia(event.target, O.inlineBackgroundBlock) || getMediaAnchor(event.target)) {
          return stop(event);
        }
      }, { capture: true, passive: false });
    }

    if (O.mediaDrag) {
      ['dragstart', 'drag', 'selectstart', 'copy', 'cut'].forEach((name) => {
        document.addEventListener(name, (event) => {
          if (hasProtectedEventTarget(event, O.inlineBackgroundBlock)) return stop(event);
          if ((name === 'copy' || name === 'cut') && selectionContainsMedia()) return stop(event);
        }, { capture: true, passive: false });
      });
    }

    if (O.mediaPointerBlock) {
      ['mousedown', 'mouseup', 'auxclick'].forEach((name) => {
        document.addEventListener(name, (event) => {
          if (event.button === 0 && name !== 'auxclick') return undefined;
          if (hasProtectedEventTarget(event, O.inlineBackgroundBlock) || getMediaAnchor(event.target)) {
            return stop(event);
          }
          return undefined;
        }, { capture: true, passive: false });
      });
    }

    if (O.mediaTouchBlock) {
      ['touchstart', 'touchmove', 'gesturestart'].forEach((name) => {
        document.addEventListener(name, (event) => {
          if (closestProtectedMedia(event.target, O.inlineBackgroundBlock)) return stop(event);
        }, { capture: true, passive: false });
      });
    }
  };

  const installDownloadLinkBlockers = () => {
    if (!O.downloadLinkBlock) return;

    ['click', 'auxclick'].forEach((name) => {
      document.addEventListener(name, (event) => {
        const anchor = closest(event.target, MEDIA_LINK_SELECTOR);

        if (isProtectedDownloadAnchor(anchor)) return stop(event);
      }, { capture: true, passive: false });
    });
  };

  const installMutationObserver = () => {
    if (!O.mediaDrag && !O.selfHealingStyle && !O.downloadLinkBlock && !O.printCssBlock) return;

    new MutationObserver((mutations) => {
      if (O.selfHealingStyle && O.imgCss) {
        injectImgCss();
      }

      if (O.printBlock && O.printCssBlock) {
        injectPrintCss();
      }

      if (!O.mediaDrag && !O.downloadLinkBlock) return;

      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          const target = mutation.target;

          if (target && target.nodeType === Node.ELEMENT_NODE) {
            if (O.mediaDrag && target.matches && target.matches(MEDIA_ATTR_SELECTOR)) {
              protectMediaAttrs(target);
            }

            if (O.downloadLinkBlock && target.matches && target.matches(MEDIA_LINK_SELECTOR)) {
              protectDownloadLinks(target);
            }
          }
        }

        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (O.mediaDrag) protectMediaAttrs(node);
          if (O.downloadLinkBlock) protectDownloadLinks(node);
        }
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      attributeFilter: [
        'class',
        'controlslist',
        'disablepictureinpicture',
        'download',
        'draggable',
        'href',
        'rel',
        'src',
        'srcset',
        'style'
      ]
    });
  };

  const rememberKey = (event) => {
    const k = key(event);
    const c = code(event);

    if (k) pressedKeys.add(k);
    if (c) pressedKeys.add(c);

    if (event.ctrlKey) pressedKeys.add('control');
    if (event.shiftKey) pressedKeys.add('shift');
    if (event.metaKey) pressedKeys.add('meta');
    if (event.altKey) pressedKeys.add('alt');

    if (k === 'meta' || k === 'os' || k === 'win' || k === 'super' || c === 'metaleft' || c === 'metaright' || c === 'osleft' || c === 'osright') {
      pressedKeys.add('meta');
      pressedKeys.add('win');
    }

    if (k === 'control' || c === 'controlleft' || c === 'controlright') pressedKeys.add('control');
    if (k === 'shift' || c === 'shiftleft' || c === 'shiftright') pressedKeys.add('shift');
    if (k === 'alt' || k === 'option' || c === 'altleft' || c === 'altright') pressedKeys.add('alt');
  };

  const forgetKey = (event) => {
    const k = key(event);
    const c = code(event);

    if (k) pressedKeys.delete(k);
    if (c) pressedKeys.delete(c);

    if (!event.ctrlKey) pressedKeys.delete('control');
    if (!event.shiftKey) pressedKeys.delete('shift');

    if (!event.metaKey) {
      pressedKeys.delete('meta');
      pressedKeys.delete('win');
    }

    if (!event.altKey) pressedKeys.delete('alt');
  };

  const clearRememberedKeys = () => {
    pressedKeys.clear();
    earlyScreenshotBlurActive = false;
  };

  const hasAny = (...values) => values.some((value) => pressedKeys.has(value));

  const getModifiers = (event) => {
    const ctrl = event.ctrlKey || hasAny('control');
    const shift = event.shiftKey || hasAny('shift');
    const meta = event.metaKey || hasAny('meta', 'win');
    const alt = event.altKey || hasAny('alt');

    return {
      ctrl,
      shift,
      meta,
      alt,
      ctrlOrMeta: ctrl || meta
    };
  };

  const isBlockedShortcut = (event) => {
    const k = key(event);
    const c = code(event);
    const { ctrl, shift, meta, alt, ctrlOrMeta } = getModifiers(event);

    return (
      k === 'f12' ||
      c === 'f12' ||
      (O.saveBlock && ctrlOrMeta && !shift && !alt && (k === 's' || c === 'keys')) ||
      (O.printBlock && ctrlOrMeta && !shift && !alt && (k === 'p' || c === 'keyp')) ||
      (ctrlOrMeta && !shift && !alt && (k === 'u' || c === 'keyu')) ||
      (ctrl && shift && ['i', 'j', 'c', 'k', 'e'].includes(k)) ||
      (ctrl && shift && ['keyi', 'keyj', 'keyc', 'keyk', 'keye'].includes(c)) ||
      (meta && alt && ['i', 'j', 'c', 'u'].includes(k)) ||
      (meta && alt && ['keyi', 'keyj', 'keyc', 'keyu'].includes(c))
    );
  };

  const isDevtoolsAccessShortcut = (event) => {
    const k = key(event);
    const c = code(event);
    const { ctrl, shift, meta, alt, ctrlOrMeta } = getModifiers(event);

    return (
      k === 'f12' ||
      c === 'f12' ||
      (ctrlOrMeta && !shift && !alt && (k === 'u' || c === 'keyu')) ||
      (ctrl && shift && ['i', 'j', 'c', 'k', 'e'].includes(k)) ||
      (ctrl && shift && ['keyi', 'keyj', 'keyc', 'keyk', 'keye'].includes(c)) ||
      (meta && alt && ['i', 'j', 'c', 'u'].includes(k)) ||
      (meta && alt && ['keyi', 'keyj', 'keyc', 'keyu'].includes(c))
    );
  };

  const stopBlockedShortcut = (event) => {
    if (O.redirectOnDevtoolsShortcut && isDevtoolsAccessShortcut(event)) {
      detected('devtools-shortcut', {
        key: event.key || '',
        code: event.code || ''
      });
    }

    return stop(event);
  };

  const isEarlyScreenshotModifierCombo = (event) => {
    const { shift, meta, alt } = getModifiers(event);

    if (O.earlyWindowsSnipBlur && isWindowsPlatform && meta && shift && !alt) {
      return true;
    }

    if (O.earlyMacOptionScreenshotBlur && isApplePlatform && meta && shift && alt) {
      return true;
    }

    if (O.earlyMacCmdShiftBlur && isApplePlatform && meta && shift) {
      return true;
    }

    return false;
  };

  const isEarlyScreenshotComboStillHeld = () => {
    const shift = hasAny('shift');
    const meta = hasAny('meta', 'win');
    const alt = hasAny('alt');

    if (O.earlyWindowsSnipBlur && isWindowsPlatform && meta && shift && !alt) {
      return true;
    }

    if (O.earlyMacOptionScreenshotBlur && isApplePlatform && meta && shift && alt) {
      return true;
    }

    if (O.earlyMacCmdShiftBlur && isApplePlatform && meta && shift) {
      return true;
    }

    return false;
  };

  const isScreenshotShortcut = (event) => {
    const k = key(event);
    const c = code(event);
    const { ctrl, shift, meta, alt } = getModifiers(event);

    const isPrintScreen =
      k === 'printscreen' ||
      c === 'printscreen' ||
      k === 'snapshot';

    const isWindowsSnip =
      isWindowsPlatform &&
      meta &&
      shift &&
      !alt &&
      (k === 's' || c === 'keys' || hasAny('s', 'keys'));

    const isMacScreenshot =
      isApplePlatform &&
      meta &&
      shift &&
      (
        k === '3' ||
        k === '4' ||
        k === '5' ||
        c === 'digit3' ||
        c === 'digit4' ||
        c === 'digit5' ||
        hasAny('3', '4', '5', 'digit3', 'digit4', 'digit5')
      );

    const isMacScreenshotWithOption =
      isApplePlatform &&
      meta &&
      shift &&
      alt &&
      (
        k === '3' ||
        k === '4' ||
        k === '5' ||
        c === 'digit3' ||
        c === 'digit4' ||
        c === 'digit5' ||
        hasAny('3', '4', '5', 'digit3', 'digit4', 'digit5')
      );

    const isChromeOsScreenshot =
      ctrl &&
      shift &&
      (
        k === 'showallwindows' ||
        c === 'showallwindows' ||
        k === 'f5' ||
        c === 'f5'
      );

    return (
      isPrintScreen ||
      isWindowsSnip ||
      isMacScreenshot ||
      isMacScreenshotWithOption ||
      isChromeOsScreenshot
    );
  };

  const installKeybinds = () => {
    if (!O.devtools || !O.keybinds) return;

    document.addEventListener('keydown', (event) => {
      if (isBlockedShortcut(event)) return stopBlockedShortcut(event);
    }, true);
  };

  const installGlobalContextMenu = () => {
    if (!O.devtools || !O.globalContext) return;

    document.addEventListener('contextmenu', (event) => stop(event), true);
  };

  const ensureBlurOverlay = () => {
    if (blurOverlay) return blurOverlay;

    blurOverlay = document.getElementById(FULL_SCREEN_BLUR_ID);

    if (!blurOverlay) {
      blurOverlay = document.createElement('div');
      blurOverlay.id = FULL_SCREEN_BLUR_ID;
      blurOverlay.setAttribute('aria-hidden', 'true');
      document.documentElement.appendChild(blurOverlay);
    }

    blurOverlay.style.cssText = `position:fixed;inset:0;z-index:${FULL_SCREEN_BLUR_Z};pointer-events:auto;opacity:0;visibility:hidden;transition:opacity 80ms linear;backdrop-filter:blur(${FULL_SCREEN_BLUR_AMOUNT}px);-webkit-backdrop-filter:blur(${FULL_SCREEN_BLUR_AMOUNT}px);background:${FULL_SCREEN_BLUR_BG};transform:translateZ(0)`;
    return blurOverlay;
  };

  const showPrivacyBlur = () => {
    if (!O.blurOnFocusLoss) return;

    const el = ensureBlurOverlay();
    clearTimeout(blurHideTimer);
    blurShownAt = performance.now();
    el.style.visibility = 'visible';
    el.style.opacity = '1';
  };

  const hardShowPrivacyBlur = () => {
    if (!O.blurOnFocusLoss) return;

    const el = ensureBlurOverlay();

    clearTimeout(blurHideTimer);
    blurShownAt = performance.now();

    el.style.transition = 'none';
    el.style.visibility = 'visible';
    el.style.opacity = '1';

    void el.offsetHeight;

    requestAnimationFrame(() => {
      if (el) el.style.transition = 'opacity 80ms linear';
    });
  };

  const hidePrivacyBlur = () => {
    if (!O.blurOnFocusLoss || !blurOverlay) return;

    const elapsed = performance.now() - blurShownAt;
    const delay = Math.max(FULL_SCREEN_BLUR_HIDE_DELAY, FULL_SCREEN_BLUR_MIN_DURATION - elapsed);

    clearTimeout(blurHideTimer);

    blurHideTimer = setTimeout(() => {
      if (document.hidden || !document.hasFocus()) return;
      blurOverlay.style.opacity = '0';
      blurOverlay.style.visibility = 'hidden';
    }, delay);
  };

  const hideEarlyScreenshotBlurIfNeeded = () => {
    if (!earlyScreenshotBlurActive) return;

    setTimeout(() => {
      if (isEarlyScreenshotComboStillHeld()) return;
      earlyScreenshotBlurActive = false;
      if (!document.hidden && document.hasFocus()) hidePrivacyBlur();
    }, EARLY_SCREENSHOT_RELEASE_DELAY);
  };

  const blockScreenshotShortcut = (event) => {
    hardShowPrivacyBlur();
    stop(event);

    setTimeout(() => {
      earlyScreenshotBlurActive = false;
      if (!document.hidden && document.hasFocus()) hidePrivacyBlur();
    }, SCREENSHOT_BLUR_HOLD);

    return false;
  };

  const installPrivacyBlur = () => {
    if (!O.blurOnFocusLoss) return;

    ensureBlurOverlay();

    window.addEventListener('blur', showPrivacyBlur, true);
    window.addEventListener('focus', hidePrivacyBlur, true);
    window.addEventListener('pagehide', showPrivacyBlur, true);
    window.addEventListener('pageshow', hidePrivacyBlur, true);
    document.addEventListener('freeze', showPrivacyBlur, true);
    document.addEventListener('resume', hidePrivacyBlur, true);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) showPrivacyBlur();
      else hidePrivacyBlur();
    }, true);
  };

  const handleSensitiveKeyEvent = (event, eventName) => {
    if (eventName === 'keydown') {
      rememberKey(event);

      if (O.screenshotProtection && isEarlyScreenshotModifierCombo(event)) {
        earlyScreenshotBlurActive = true;
        hardShowPrivacyBlur();
      }

      if (O.screenshotProtection && isScreenshotShortcut(event)) {
        return blockScreenshotShortcut(event);
      }

      if (isBlockedShortcut(event)) {
        return stopBlockedShortcut(event);
      }
    } else {
      if (O.screenshotProtection && isScreenshotShortcut(event)) {
        stop(event);
      }

      forgetKey(event);
      hideEarlyScreenshotBlurIfNeeded();
    }

    return undefined;
  };

  const installScreenshotAndSaveProtection = () => {
    if (!O.screenshotProtection && !O.saveBlock && !O.printBlock) return;

    ['keydown', 'keyup'].forEach((eventName) => {
      window.addEventListener(eventName, (event) => handleSensitiveKeyEvent(event, eventName), true);
      document.addEventListener(eventName, (event) => handleSensitiveKeyEvent(event, eventName), true);
    });

    if (O.printBlock || O.screenshotProtection) {
      window.addEventListener('beforeprint', hardShowPrivacyBlur, true);
      window.addEventListener('afterprint', hidePrivacyBlur, true);
    }

    window.addEventListener('blur', clearRememberedKeys, true);
    window.addEventListener('pagehide', clearRememberedKeys, true);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearRememberedKeys();
    }, true);
  };

  const installPrintProtection = () => {
    if (!O.printBlock) return;

    injectPrintCss();

    const originalPrint = typeof window.print === 'function' ? window.print.bind(window) : null;
    const guardedPrint = () => {
      injectPrintCss();

      if (O.blurOnFocusLoss) {
        hardShowPrivacyBlur();
      }

      return false;
    };

    try {
      Object.defineProperty(window, 'print', {
        value: guardedPrint,
        configurable: true
      });
    } catch (_) {
      try {
        window.print = guardedPrint;
      } catch (__) {
        if (originalPrint) window.addEventListener('beforeprint', injectPrintCss, true);
      }
    }
  };

  const checkSize = () => {
    if (skipDevtoolsCheck()) return;

    const widthGap = Math.abs(window.outerWidth - window.innerWidth);
    const heightGap = Math.abs(window.outerHeight - window.innerHeight);
    const suspicious = widthGap > O.sizeWidthThreshold || heightGap > O.sizeHeightThreshold;

    sizeHits = suspicious ? sizeHits + 1 : 0;

    if (sizeHits >= O.sizeHits) {
      detected('size-check', {
        outerWidth: window.outerWidth,
        innerWidth: window.innerWidth,
        outerHeight: window.outerHeight,
        innerHeight: window.innerHeight,
        widthGap,
        heightGap
      });
    }
  };

  const installSizeCheck = () => {
    if (!O.devtools || !O.sizeCheck) return;
    setInterval(checkSize, O.sizeInterval);
  };

  const installEventLoopLagCheck = () => {
    if (!O.devtools || !O.eventLoopLag) return;

    lastEventLoopTick = performance.now();

    setInterval(() => {
      if (skipDevtoolsCheck()) return;

      const now = performance.now();
      const expected = lastEventLoopTick + O.eventLoopInterval;
      const lag = now - expected;

      lastEventLoopTick = now;
      eventLoopHits = lag > O.eventLoopThreshold ? eventLoopHits + 1 : 0;

      if (eventLoopHits >= O.eventLoopHits) {
        detected('event-loop-lag-check', { lagMs: Math.round(lag) });
      }
    }, O.eventLoopInterval);
  };

  const installConsoleBait = () => {
    if (!O.devtools || !O.consoleBait) return;

    const bait = new Image();

    Object.defineProperty(bait, 'id', {
      get() {
        consoleBaitHits += 1;
        if (consoleBaitHits >= CONSOLE_BAIT_HITS) detected('console-bait-check');
        return 'devtools-detected';
      }
    });

    setInterval(() => {
      if (skipDevtoolsCheck()) return;
      console.log(bait);
      console.clear();
    }, CONSOLE_BAIT_INTERVAL);
  };

  const installDecoys = () => {
    if (!O.decoys) return;

    const bucket = [
      () => Math.random().toString(36).slice(2),
      () => document.readyState,
      () => location.hostname.split('').reverse().join(''),
      () => Date.now() ^ 0x2f3a,
      () => navigator.userAgent.length
    ];

    let index = 0;

    setInterval(() => {
      index = (index + 1) % bucket.length;
      try {
        bucket[index]();
      } catch (_) {}
    }, 1377);
  };

  const tailDebuggerProbe = () => {
    const start = performance.now();
    debugger;
    return performance.now() - start;
  };

  const runDebuggerCheck = () => {
    if (skipDevtoolsCheck()) return;

    const elapsed = tailDebuggerProbe();
    const suspicious = elapsed > O.debuggerThreshold;

    debuggerHits = suspicious ? debuggerHits + 1 : 0;

    if (debuggerHits >= O.debuggerHits) {
      detected('debugger-timing-check', {
        elapsedMs: Math.round(elapsed)
      });
    }
  };

  const installDebuggerCheck = () => {
    if (!O.devtools || !O.debuggerTiming) return;

    setInterval(() => {
      runDebuggerCheck();

      if (O.debuggerLoop && !handled) {
        runDebuggerCheck();
      }
    }, O.debuggerInterval);
  };

  onReady(() => {
    injectImgCss();
    protectMediaAttrs();
    installMediaBlockers();
    installMutationObserver();
    installDevtoolsLifecycleGuard();
    installPrivacyBlur();
    installScreenshotAndSaveProtection();
    installPrintProtection();
    installKeybinds();
    installGlobalContextMenu();
    installSizeCheck();
    installEventLoopLagCheck();
    installConsoleBait();
    installDecoys();
    installDebuggerCheck();
  });
})();
