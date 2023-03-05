import React, { useState, useEffect } from 'react';

// Render component based on URL path name
export function Route({ pathName, children }) {
  const [currentPathName, setCurrentPathName] = useState(window.location.pathname);

  useEffect(() => {
    function onPathChange(event) {
      console.log('popstate event invoked');
      setCurrentPathName(window.location.pathname);
    }

    window.addEventListener('popstate', onPathChange);

    return () => window.removeEventListener('popstate', onPathChange);
  }, []);

  return currentPathName === pathName ? children : null;
}

// Redirect to a new URL
export function redirect(url, state = {}) {
  history.pushState(state, '', url);

  const popStateEvent = new PopStateEvent('popstate', { state: state });
  dispatchEvent(popStateEvent);
}
