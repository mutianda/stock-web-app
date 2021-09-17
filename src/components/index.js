import CoolModal from "./cool-modal";
import CoolButton from "./cool-button";
import CoolPagination from "./cool-pagination";
import CoolShareCard from './cool-share-card'
const components = [
  { com: CoolModal, name: "CoolModal" },
  { com: CoolButton, name: "CoolButton" },
  { com: CoolPagination, name: "CoolPagination" },
  { com: CoolShareCard, name: "CoolShareCard" }

];
const install = function(Vue) {
  components.forEach(item => {
    Vue.component(item.name, item.com);
  });
};
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  version: "1.0.0",
  install,
  CoolModal
};
