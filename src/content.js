let outerObserver = null;
let innerObservers = new Set(); // Keep track of all inner observers
let active = false;

const outerTargetSelector = '.results';
const buttonSelector = '.direct-btn';

function clickButtonIfFound(container) {
    const btn = container.querySelector(buttonSelector);
    if (btn) {
        btn.click();
        console.log('[AutoClicker] Clicked .direct-btn inside new element');
        return true;
    }
    return false;
}

function watchNewElementForButton(newEl) {
    const innerObserver = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                if (clickButtonIfFound(newEl)) {
                    observer.disconnect();
                    innerObservers.delete(observer); // Remove from tracked observers
                    break;
                }
            }
        }
    });

    innerObserver.observe(newEl, { childList: true, subtree: true });
    innerObservers.add(innerObserver); // Track this observer
    console.log('[AutoClicker] Watching new element for .direct-btn');
}

function startObserving() {
    const outerTarget = document.querySelector(outerTargetSelector);
    if (!outerTarget) {
        console.warn(`[AutoClicker] Target ${outerTargetSelector} not found.`);
        return;
    }

    outerObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        console.log('[AutoClicker] New element added to .results');
                        watchNewElementForButton(node);
                    }
                });
            }
        }
    });

    outerObserver.observe(outerTarget, { childList: true });
    console.log('[AutoClicker] Observer started');
}

function stopObserving() {
    if (outerObserver) {
        outerObserver.disconnect();
        outerObserver = null;
        console.log('[AutoClicker] Outer observer stopped');
    }

    // Disconnect all inner observers
    innerObservers.forEach(observer => observer.disconnect());
    innerObservers.clear();
    console.log('[AutoClicker] All inner observers stopped');
}

// Listen for toggle messages from the popup
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'toggle-autoclicker') {
        active = msg.state;
        if (active) {
            startObserving();
        } else {
            stopObserving();
        }
    }
});