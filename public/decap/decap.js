window.CMS_MANUAL_INIT = true;

const script = document.createElement("script");
script.src =
  "https://unpkg.com/decap-cms@latest/dist/decap-cms.js";

script.onload = function () {
  window.CMS.init({
    config: "/decap/config.yml",
  });
};

document.body.appendChild(script);
