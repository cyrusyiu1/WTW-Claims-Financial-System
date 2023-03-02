// if (!process.env.REACT_APP_IMAGE_PREFIX) {
//     console.error('missing REACT_APP_IMAGE_PREFIX environment variable')
// }

export let env = {
    // imagePrefix: process.env.REACT_APP_IMAGE_PREFIX || '?',
    apiOrigin:
      (window.location.origin === "http://localhost:3000"
        ? process.env.REACT_APP_API_SERVER
        : process.env.REACT_APP_PROD_API_SERVER) || "?",
  };
  
  if (!process.env.REACT_APP_API_SERVER) {
    console.error("missing LOCAL_API_SERVER in environment variable");
  }
  
  if (env.apiOrigin === "?") {
    console.error("missing PROD_API_SERVER in environment variable");
  }
  