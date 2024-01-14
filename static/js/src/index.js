/*eslint-disable */
import InitialData from './initialData.js';

const App = () => {
  const [excalidrawAPI, setExcalidrawAPI] = React.useState(null);
  const excalidrawWrapperRef = React.useRef(null);
  const [dimensions, setDimensions] = React.useState({
    width: undefined,
    height: undefined,
  });

  const [viewModeEnabled, setViewModeEnabled] = React.useState(false);
  const [zenModeEnabled, setZenModeEnabled] = React.useState(false);
  const [gridModeEnabled, setGridModeEnabled] = React.useState(false);

  React.useEffect(() => {
    setDimensions({
      width: excalidrawWrapperRef.current.getBoundingClientRect().width,
      height: excalidrawWrapperRef.current.getBoundingClientRect().height,
    });
    const onResize = () => {
      setDimensions({
        width: excalidrawWrapperRef.current.getBoundingClientRect().width,
        height: excalidrawWrapperRef.current.getBoundingClientRect().height,
      });
    };

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [excalidrawWrapperRef]);

  const updateScene = () => {
    const sceneData = {
      elements: [
        {
          type: 'rectangle',
          version: 141,
          versionNonce: 361174001,
          isDeleted: false,
          id: 'oDVXy8D6rom3H1-LLH2-f',
          fillStyle: 'hachure',
          strokeWidth: 1,
          strokeStyle: 'solid',
          roughness: 1,
          opacity: 100,
          angle: 0,
          x: 100.50390625,
          y: 93.67578125,
          strokeColor: '#c92a2a',
          backgroundColor: 'transparent',
          width: 186.47265625,
          height: 141.9765625,
          seed: 1968410350,
          groupIds: [],
        },
      ],
      appState: {
        viewBackgroundColor: '#fff6ef',
      },
    };
    excalidrawAPI.updateScene(sceneData);
  };

  return React.createElement(
      React.Fragment,
      null,
      React.createElement(
          'div',
          {className: 'button-wrapper', 'data-aos': 'fade-up', 'data-aos-duration':1000},
          React.createElement(
              'button',
              {
                className: 'btn btn-orange w-auto',
                onClick: updateScene,
              },
              'Kemaskini Sceen',
          ),
          React.createElement(
              'button',
              {
                className: 'btn btn-danger w-auto',
                onClick: () => excalidrawAPI.resetScene(),
              },
              'Set Semula Sceen',
          ),
          React.createElement(
              'label',
              {className: 'form-check-label ms-auto'},
              React.createElement('input', {
                type: 'checkbox',
                className: 'form-check-input me-2 ms-3',
                checked: viewModeEnabled,
                onChange: () => setViewModeEnabled(!viewModeEnabled),
              }),
              'Mod Paparan',
          ),
          React.createElement(
              'label',
              {lassName: 'form-check-label'},
              React.createElement('input', {
                type: 'checkbox',
                className: 'form-check-input me-2 ms-3',
                checked: zenModeEnabled,
                onChange: () => setZenModeEnabled(!zenModeEnabled),
              }),
              'Mod Zen',
          ),
          React.createElement(
              'label',
              {className: 'form-check-label'},
              React.createElement('input', {
                type: 'checkbox',
                className: 'form-check-input me-2 ms-3',
                checked: gridModeEnabled,
                onChange: () => setGridModeEnabled(!gridModeEnabled),
              }),
              'Mod Grid',
          ),
      ),
      React.createElement('hr'),
      React.createElement(
          'div',
          {
            className: 'excalidraw-wrapper',
            ref: excalidrawWrapperRef,
          },
          React.createElement(ExcalidrawLib.Excalidraw, {
            initialData: InitialData,
            excalidrawAPI: (api) => setExcalidrawAPI(api),
            zenModeEnabled,
            gridModeEnabled,
            viewModeEnabled,
            langCode: 'id-ID',
          }),
      ),
  );
};

const excalidrawWrapper = document.getElementById('app');
const root = ReactDOM.createRoot(excalidrawWrapper);
root.render(React.createElement(App));

// Target element class name
const targetClassName = 'library-menu-browse-button';

// Function to modify the href attribute
const modifyHref = function(element) {
  const desiredURL = 'https://libraries.excalidraw.com/?theme=light&sort=default'; // Set your desired URL

  // Check if the href attribute doesn't exist or is different
  if (element.href !== desiredURL) {
    element.href = desiredURL;
    console.log('Element with class name', targetClassName, 'modified:',
        element);
    // Perform your desired actions here
  }
};

// Callback function to handle mutations
const mutationCallback = function(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // Traverse the DOM tree to find the target element
      const libraryMenuContainer = document.querySelector('.layer-ui__library');
      if (libraryMenuContainer) {
        const targetElement = libraryMenuContainer.querySelector(
            '.' + targetClassName);
        if (targetElement) {
          modifyHref(targetElement);
        }
      }
    }
  }
};

// Create a MutationObserver instance
const observer = new MutationObserver(mutationCallback);

// Target node to observe (the entire document body in this example)
const targetNode = document.body;

// Configuration of the observer (we want to watch for childList changes)
const config = {childList: true, subtree: true};

// Start observing the target node with the specified configuration
observer.observe(targetNode, config);

// To disconnect the observer later when it's no longer needed
// observer.disconnect();
