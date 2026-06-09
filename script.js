(() => {
  'use strict';

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
   *     blocks Ctrl+S / Cmd+S, Ctrl+P / Cmd+P, page source shortcuts.
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
      devtools: false,
      sizeCheck: false,
      keybinds: false,
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
      devtools: false,
      sizeCheck: false,
      keybinds: false,
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
      devtools: true,
      sizeCheck: true,
      keybinds: true,
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
      devtools: true,
      sizeCheck: true,
      keybinds: true,
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
      saveBlock: true,
      printBlock: true,
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
      devtools: true,
      sizeCheck: true,
      keybinds: true,
      globalContext: false,
      debuggerTiming: true,
      debuggerLoop: false,
      consoleBait: false,
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
  const MEDIA_SELECTOR = 'img,video,picture,source,canvas,svg,image,object,embed';
  const IMG_SELECTOR = 'img,picture img,svg image';
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

  if (LEVEL <= 0) return;

  const startedAt = performance.now();
  const pressedKeys = new Set();

  let handled = false;
  let sizeHits = 0;
  let debuggerHits = 0;
  let eventLoopHits = 0;
  let consoleBaitHits = 0;
  let lastEventLoopTick = performance.now();
  let blurOverlay = null;
  let blurShownAt = 0;
  let blurHideTimer = 0;
  let earlyScreenshotBlurActive = false;

  const platformText = `${navigator.platform || ''} ${navigator.userAgent || ''}`.toLowerCase();
  const isApplePlatform = /mac|iphone|ipad|ipod/.test(platformText);
  const isWindowsPlatform = /win/.test(platformText);

  const isAfterGracePeriod = () => performance.now() - startedAt >= O.startupGrace;
  const isHidden = () => IGNORE_CHECKS_WHEN_TAB_HIDDEN && document.hidden;
  const normalizeUrl = (url) => /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  const closest = (target, selector) => {
    if (!target) return null;
    let node = target.nodeType === Node.ELEMENT_NODE ? target : target.parentElement;
    return node && typeof node.closest === 'function' ? node.closest(selector) : null;
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

  const injectImgCss = () => {
    if (!O.imgCss || document.getElementById(IMG_STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = IMG_STYLE_ID;
    style.textContent = `${IMG_SELECTOR}{pointer-events:none!important;-webkit-user-drag:none!important;user-drag:none!important;-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important;touch-action:none!important}`;
    document.head.appendChild(style);
  };

  const protectMediaAttrs = (root = document) => {
    if (!O.mediaDrag) return;

    root.querySelectorAll('img,video,canvas,svg,object,embed').forEach((el) => {
      try {
        el.setAttribute('draggable', 'false');
        el.draggable = false;
      } catch (_) {}
    });
  };

  const installMediaBlockers = () => {
    if (O.mediaContext) {
      document.addEventListener('contextmenu', (event) => {
        if (closest(event.target, MEDIA_SELECTOR)) return stop(event);
      }, true);
    }

    if (O.mediaDrag) {
      ['dragstart', 'drag', 'selectstart', 'copy', 'cut'].forEach((name) => {
        document.addEventListener(name, (event) => {
          if (closest(event.target, MEDIA_SELECTOR)) return stop(event);
        }, true);
      });
    }
  };

  const installMutationObserver = () => {
    if (!O.mediaDrag && !O.selfHealingStyle) return;

    new MutationObserver((mutations) => {
      if (O.selfHealingStyle && O.imgCss && !document.getElementById(IMG_STYLE_ID)) {
        injectImgCss();
      }

      if (!O.mediaDrag) return;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (node.matches && node.matches(MEDIA_SELECTOR)) protectMediaAttrs(node.parentElement || document);
          else if (node.querySelectorAll) protectMediaAttrs(node);
        }
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true
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

    if (k === 'f12' || c === 'f12') return true;

    if (O.saveBlock && ctrlOrMeta && !shift && !alt && (k === 's' || c === 'keys')) {
      return true;
    }

    if (O.printBlock && ctrlOrMeta && !shift && !alt && (k === 'p' || c === 'keyp')) {
      return true;
    }

    if (ctrlOrMeta && !shift && !alt && (k === 'u' || c === 'keyu')) return true;
    if (ctrl && shift && ['i', 'j', 'c', 'k', 'e'].includes(k)) return true;
    if (ctrl && shift && ['keyi', 'keyj', 'keyc', 'keyk', 'keye'].includes(c)) return true;
    if (meta && alt && ['i', 'j', 'c', 'u'].includes(k)) return true;
    if (meta && alt && ['keyi', 'keyj', 'keyc', 'keyu'].includes(c)) return true;

    return false;
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
      if (isBlockedShortcut(event)) return stop(event);
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
        return stop(event);
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

  const checkSize = () => {
    if (!isAfterGracePeriod() || isHidden()) return;

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
      if (!isAfterGracePeriod() || isHidden()) {
        lastEventLoopTick = performance.now();
        eventLoopHits = 0;
        return;
      }

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
      if (!isAfterGracePeriod() || isHidden()) return;
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
    if (!isAfterGracePeriod() || isHidden()) return;

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
    installPrivacyBlur();
    installScreenshotAndSaveProtection();
    installKeybinds();
    installGlobalContextMenu();
    installSizeCheck();
    installEventLoopLagCheck();
    installConsoleBait();
    installDecoys();
    installDebuggerCheck();
  });
})();
