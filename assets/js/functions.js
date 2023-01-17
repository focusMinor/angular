export function useDynamicAdapt(type = "max") {
   const className = "_dynamic_adapt_";
   const attrName = "data-da";

   const dNodes = getDNodes();

   const dMediaQueries = getDMediaQueries(dNodes);

   dMediaQueries.forEach((dMediaQuery) => {
      const matchMedia = window.matchMedia(dMediaQuery.query);
      const filteredDNodes = dNodes.filter(
         ({ breakpoint }) => breakpoint === dMediaQuery.breakpoint
      );
      const mediaHandler = getMediaHandler(matchMedia, filteredDNodes);
      matchMedia.addEventListener("change", mediaHandler);

      mediaHandler();
   });

   function getDNodes() {
      const result = [];
      const elements = [...document.querySelectorAll(`[${attrName}]`)];

      elements.forEach((element) => {
         const attr = element.getAttribute(attrName);
         const [toSelector, breakpoint, order] = attr
            .split(",")
            .map((val) => val.trim());

         const to = document.querySelector(toSelector);

         if (to) {
            result.push({
               parent: element.parentElement,
               element,
               to,
               breakpoint: breakpoint ?? "767",
               order:
                  order !== undefined
                     ? isNumber(order)
                        ? Number(order)
                        : order
                     : "last",
               index: -1,
            });
         }
      });

      return sortDNodes(result);
   }

   function getDMediaQueries(items) {
      const uniqItems = [
         ...new Set(
            items.map(
               ({ breakpoint }) =>
                  `(${type}-width: ${breakpoint}px),${breakpoint}`
            )
         ),
      ];

      return uniqItems.map((item) => {
         const [query, breakpoint] = item.split(",");

         return { query, breakpoint };
      });
   }

   function getMediaHandler(matchMedia, items) {
      return function mediaHandler() {
         if (matchMedia.matches) {
            items.forEach((item) => {
               moveTo(item);
            });

            items.reverse();
         } else {
            items.forEach((item) => {
               if (item.element.classList.contains(className)) {
                  moveBack(item);
               }
            });

            items.reverse();
         }
      };
   }

   function moveTo(dNode) {
      const { to, element, order } = dNode;
      dNode.index = getIndexInParent(
         dNode.element,
         dNode.element.parentElement
      );
      element.classList.add(className);

      if (order === "last" || order >= to.children.length) {
         to.append(element);

         return;
      }

      if (order === "first") {
         to.prepend(element);

         return;
      }

      to.children[order].before(element);
   }

   function moveBack(dNode) {
      const { parent, element, index } = dNode;
      element.classList.remove(className);

      if (index >= 0 && parent.children[index]) {
         parent.children[index].before(element);
      } else {
         parent.append(element);
      }
   }

   function getIndexInParent(element, parent) {
      return [...parent.children].indexOf(element);
   }

   function sortDNodes(items) {
      const isMin = type === "min" ? 1 : 0;

      return [...items].sort((a, b) => {
         if (a.breakpoint === b.breakpoint) {
            if (a.order === b.order) {
               return 0;
            }

            if (a.order === "first" || b.order === "last") {
               return -1 * isMin;
            }

            if (a.order === "last" || b.order === "first") {
               return 1 * isMin;
            }

            return 0;
         }

         return (a.breakpoint - b.breakpoint) * isMin;
      });
   }

   function isNumber(value) {
      return !isNaN(value);
   }
}

export function isWebp() {
   function testWebP(callback) {
      let webP = new Image();
      webP.onload = webP.onerror = function () {
         callback(webP.height == 2);
      };
      webP.src =
         "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
   }
   testWebP(function (support) {
      let className = support === true ? "webp" : "no-webp";
      document.documentElement.classList.add(className);
   });
}

export function addTouchClass() {
   if (isMobile.any()) document.documentElement.classList.add("touch");
}

export function fullVHfix() {
   const fullScreens = document.querySelectorAll("[data-fullscreen]");
   if (fullScreens.length && isMobile.any()) {
      window.addEventListener("resize", fixHeight);
      function fixHeight() {
         let vh = window.innerHeight * 0.01;
         document.documentElement.style.setProperty("--vh", `${vh}px`);
      }
      fixHeight();
   }
}

export function getHash() {
   if (location.hash) {
      return location.hash.replace("#", "");
   }
}

export function setHash(hash) {
   hash = hash ? `#${hash}` : window.location.href.split("#")[0];
   history.pushState("", "", hash);
}

export let slideUp = (target, duration = 300, showmore = 0) => {
   if (!target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = `${target.offsetHeight}px`;
      target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = !showmore ? true : false;
         !showmore ? target.style.removeProperty("height") : null;
         target.style.removeProperty("padding-top");
         target.style.removeProperty("padding-bottom");
         target.style.removeProperty("margin-top");
         target.style.removeProperty("margin-bottom");
         !showmore ? target.style.removeProperty("overflow") : null;
         target.style.removeProperty("transition-duration");
         target.style.removeProperty("transition-property");
         target.classList.remove("_slide");
         // Створюємо подію
         document.dispatchEvent(
            new CustomEvent("slideUpDone", {
               detail: {
                  target: target,
               },
            })
         );
      }, duration);
   }
};

export let slideDown = (target, duration = 300, showmore = 0) => {
   if (!target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.hidden = target.hidden ? false : null;
      showmore ? target.style.removeProperty("height") : null;
      let height = target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = height + "px";
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      window.setTimeout(() => {
         target.style.removeProperty("height");
         target.style.removeProperty("overflow");
         target.style.removeProperty("transition-duration");
         target.style.removeProperty("transition-property");
         target.classList.remove("_slide");
         // Створюємо подію
         document.dispatchEvent(
            new CustomEvent("slideDownDone", {
               detail: {
                  target: target,
               },
            })
         );
      }, duration);
   }
};

export let slideToggle = (target, duration = 300) => {
   if (target.hidden) {
      return slideDown(target, duration);
   } else {
      return slideUp(target, duration);
   }
};

export function spollers() {
   const spollersArray = document.querySelectorAll("[data-spollers]");
   if (spollersArray.length > 0) {
      const spollersRegular = Array.from(spollersArray).filter(function (
         item,
         index,
         self
      ) {
         return !item.dataset.spollers.split(",")[0];
      });
      if (spollersRegular.length) {
         initSpollers(spollersRegular);
      }
      let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
      if (mdQueriesArray && mdQueriesArray.length) {
         mdQueriesArray.forEach((mdQueriesItem) => {
            mdQueriesItem.matchMedia.addEventListener("change", function () {
               initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
            initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
         });
      }
      function initSpollers(spollersArray, matchMedia = false) {
         spollersArray.forEach((spollersBlock) => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
               spollersBlock.classList.add("_spoller-init");
               initSpollerBody(spollersBlock);
               spollersBlock.addEventListener("click", setSpollerAction);
            } else {
               spollersBlock.classList.remove("_spoller-init");
               initSpollerBody(spollersBlock, false);
               spollersBlock.removeEventListener("click", setSpollerAction);
            }
         });
      }
      function initSpollerBody(spollersBlock, hideSpollerBody = true) {
         let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
         if (spollerTitles.length) {
            spollerTitles = Array.from(spollerTitles).filter(
               (item) => item.closest("[data-spollers]") === spollersBlock
            );
            spollerTitles.forEach((spollerTitle) => {
               if (hideSpollerBody) {
                  spollerTitle.removeAttribute("tabindex");
                  if (!spollerTitle.classList.contains("_spoller-active")) {
                     spollerTitle.nextElementSibling.hidden = true;
                  }
               } else {
                  spollerTitle.setAttribute("tabindex", "-1");
                  spollerTitle.nextElementSibling.hidden = false;
               }
            });
         }
      }
      function setSpollerAction(e) {
         const el = e.target;
         if (el.closest("[data-spoller]")) {
            const spollerTitle = el.closest("[data-spoller]");
            const spollersBlock = spollerTitle.closest("[data-spollers]");
            const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed
               ? parseInt(spollersBlock.dataset.spollersSpeed)
               : 300;
            if (!spollersBlock.querySelectorAll("._slide").length) {
               if (
                  oneSpoller &&
                  !spollerTitle.classList.contains("_spoller-active")
               ) {
                  hideSpollersBody(spollersBlock);
               }
               spollerTitle.classList.toggle("_spoller-active");
               slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
            }
            e.preventDefault();
         }
      }
      function hideSpollersBody(spollersBlock) {
         const spollerActiveTitle = spollersBlock.querySelector(
            "[data-spoller]._spoller-active"
         );
         const spollerSpeed = spollersBlock.dataset.spollersSpeed
            ? parseInt(spollersBlock.dataset.spollersSpeed)
            : 300;
         if (
            spollerActiveTitle &&
            !spollersBlock.querySelectorAll("._slide").length
         ) {
            spollerActiveTitle.classList.remove("_spoller-active");
            slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
         }
      }
      const spollersClose = document.querySelectorAll("[data-spoller-close]");
      if (spollersClose.length) {
         document.addEventListener("click", function (e) {
            const el = e.target;
            if (!el.closest("[data-spollers]")) {
               spollersClose.forEach((spollerClose) => {
                  const spollersBlock = spollerClose.closest("[data-spollers]");
                  if (spollersBlock.classList.contains("_spoller-init")) {
                     const spollerSpeed = spollersBlock.dataset.spollersSpeed
                        ? parseInt(spollersBlock.dataset.spollersSpeed)
                        : 300;
                     spollerClose.classList.remove("_spoller-active");
                     slideUp(spollerClose.nextElementSibling, spollerSpeed);
                  }
               });
            }
         });
      }
   }
}

export function tabs() {
   const tabs = document.querySelectorAll("[data-tabs]");
   let tabsActiveHash = [];

   if (tabs.length > 0) {
      const hash = getHash();
      if (hash && hash.startsWith("tab-")) {
         tabsActiveHash = hash.replace("tab-", "").split("-");
      }
      tabs.forEach((tabsBlock, index) => {
         tabsBlock.classList.add("_tab-init");
         tabsBlock.setAttribute("data-tabs-index", index);
         tabsBlock.addEventListener("click", setTabsAction);
         initTabs(tabsBlock);
      });

      let mdQueriesArray = dataMediaQueries(tabs, "tabs");
      if (mdQueriesArray && mdQueriesArray.length) {
         mdQueriesArray.forEach((mdQueriesItem) => {
            mdQueriesItem.matchMedia.addEventListener("change", function () {
               setTitlePosition(
                  mdQueriesItem.itemsArray,
                  mdQueriesItem.matchMedia
               );
            });
            setTitlePosition(
               mdQueriesItem.itemsArray,
               mdQueriesItem.matchMedia
            );
         });
      }
   }

   function setTitlePosition(tabsMediaArray, matchMedia) {
      tabsMediaArray.forEach((tabsMediaItem) => {
         tabsMediaItem = tabsMediaItem.item;
         let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
         let tabsTitleItems =
            tabsMediaItem.querySelectorAll("[data-tabs-title]");
         let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
         let tabsContentItems =
            tabsMediaItem.querySelectorAll("[data-tabs-item]");
         tabsTitleItems = Array.from(tabsTitleItems).filter(
            (item) => item.closest("[data-tabs]") === tabsMediaItem
         );
         tabsContentItems = Array.from(tabsContentItems).filter(
            (item) => item.closest("[data-tabs]") === tabsMediaItem
         );
         tabsContentItems.forEach((tabsContentItem, index) => {
            if (matchMedia.matches) {
               tabsContent.append(tabsTitleItems[index]);
               tabsContent.append(tabsContentItem);
               tabsMediaItem.classList.add("_tab-spoller");
            } else {
               tabsTitles.append(tabsTitleItems[index]);
               tabsMediaItem.classList.remove("_tab-spoller");
            }
         });
      });
   }

   function initTabs(tabsBlock) {
      let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
      let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
      const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
      const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

      if (tabsActiveHashBlock) {
         const tabsActiveTitle = tabsBlock.querySelector(
            "[data-tabs-titles]>._tab-active"
         );
         tabsActiveTitle
            ? tabsActiveTitle.classList.remove("_tab-active")
            : null;
      }
      if (tabsContent.length) {
         tabsContent = Array.from(tabsContent).filter(
            (item) => item.closest("[data-tabs]") === tabsBlock
         );
         tabsTitles = Array.from(tabsTitles).filter(
            (item) => item.closest("[data-tabs]") === tabsBlock
         );
         tabsContent.forEach((tabsContentItem, index) => {
            tabsTitles[index].setAttribute("data-tabs-title", "");
            tabsContentItem.setAttribute("data-tabs-item", "");

            if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
               tabsTitles[index].classList.add("_tab-active");
            }
            tabsContentItem.hidden =
               !tabsTitles[index].classList.contains("_tab-active");
         });
      }
   }

   function setTabsStatus(tabsBlock) {
      let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
      let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
      const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
      function isTabsAnamate(tabsBlock) {
         if (tabsBlock.hasAttribute("data-tabs-animate")) {
            return tabsBlock.dataset.tabsAnimate > 0
               ? Number(tabsBlock.dataset.tabsAnimate)
               : 300;
         }
      }
      const tabsBlockAnimate = isTabsAnamate(tabsBlock);
      if (tabsContent.length > 0) {
         const isHash = tabsBlock.hasAttribute("data-tabs-hash");
         tabsContent = Array.from(tabsContent).filter(
            (item) => item.closest("[data-tabs]") === tabsBlock
         );
         tabsTitles = Array.from(tabsTitles).filter(
            (item) => item.closest("[data-tabs]") === tabsBlock
         );
         tabsContent.forEach((tabsContentItem, index) => {
            if (tabsTitles[index].classList.contains("_tab-active")) {
               if (tabsBlockAnimate) {
                  slideDown(tabsContentItem, tabsBlockAnimate);
               } else {
                  tabsContentItem.hidden = false;
               }
               if (isHash && !tabsContentItem.closest(".popup")) {
                  setHash(`tab-${tabsBlockIndex}-${index}`);
               }
            } else {
               if (tabsBlockAnimate) {
                  slideUp(tabsContentItem, tabsBlockAnimate);
               } else {
                  tabsContentItem.hidden = true;
               }
            }
         });
      }
   }

   function setTabsAction(e) {
      const el = e.target;
      if (el.closest("[data-tabs-title]")) {
         const tabTitle = el.closest("[data-tabs-title]");
         const tabsBlock = tabTitle.closest("[data-tabs]");
         if (
            !tabTitle.classList.contains("_tab-active") &&
            !tabsBlock.querySelector("._slide")
         ) {
            let tabActiveTitle = tabsBlock.querySelectorAll(
               "[data-tabs-title]._tab-active"
            );
            tabActiveTitle.length
               ? (tabActiveTitle = Array.from(tabActiveTitle).filter(
                    (item) => item.closest("[data-tabs]") === tabsBlock
                 ))
               : null;
            tabActiveTitle.length
               ? tabActiveTitle[0].classList.remove("_tab-active")
               : null;
            tabTitle.classList.add("_tab-active");
            setTabsStatus(tabsBlock);
         }
         e.preventDefault();
      }
   }
}

export function bodyLockToggle(delay = 300) {
   if (document.documentElement.classList.contains("lock")) {
      bodyUnlock(delay);
   } else {
      bodyLock(delay);
   }
}

export function bodyUnlock(delay = 300) {
   let body = document.querySelector("body");
   if (bodyLockStatus) {
      let lock_padding = document.querySelectorAll("[data-lp]");
      setTimeout(() => {
         for (let index = 0; index < lock_padding.length; index++) {
            const el = lock_padding[index];
            el.style.paddingRight = "0px";
         }
         body.style.paddingRight = "0px";
         document.documentElement.classList.remove("lock");
      }, delay);
      bodyLockStatus = false;
      setTimeout(function () {
         bodyLockStatus = true;
      }, delay);
   }
}

export function bodyLock(delay = 300) {
   let body = document.querySelector("body");
   if (bodyLockStatus) {
      let lock_padding = document.querySelectorAll("[data-lp]");
      for (let index = 0; index < lock_padding.length; index++) {
         const el = lock_padding[index];
         el.style.paddingRight =
            window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";
      }
      body.style.paddingRight =
         window.innerWidth -
         document.querySelector(".wrapper").offsetWidth +
         "px";
      document.documentElement.classList.add("lock");

      bodyLockStatus = false;
      setTimeout(function () {
         bodyLockStatus = true;
      }, delay);
   }
}

export function rippleEffect() {
   document.addEventListener("click", function (e) {
      const targetItem = e.target;
      if (targetItem.closest("[data-ripple]")) {
         const button = targetItem.closest("[data-ripple]");
         const ripple = document.createElement("span");
         const diameter = Math.max(button.clientWidth, button.clientHeight);
         const radius = diameter / 2;

         ripple.style.width = ripple.style.height = `${diameter}px`;
         ripple.style.left = `${
            e.pageX - (button.getBoundingClientRect().left + scrollX) - radius
         }px`;
         ripple.style.top = `${
            e.pageY - (button.getBoundingClientRect().top + scrollY) - radius
         }px`;
         ripple.classList.add("ripple");

         button.dataset.ripple === "once" && button.querySelector(".ripple")
            ? button.querySelector(".ripple").remove()
            : null;

         button.appendChild(ripple);

         const timeOut = getAnimationDuration(ripple);

         setTimeout(() => {
            ripple ? ripple.remove() : null;
         }, timeOut);

         function getAnimationDuration() {
            const aDuration = window.getComputedStyle(ripple).animationDuration;
            return aDuration.includes("ms")
               ? aDuration.replace("ms", "")
               : aDuration.replace("s", "") * 1000;
         }
      }
   });
}

export function dataMediaQueries(array, dataSetValue) {
   const media = Array.from(array).filter(function (item, index, self) {
      if (item.dataset[dataSetValue]) {
         return item.dataset[dataSetValue].split(",")[0];
      }
   });
   if (media.length) {
      const breakpointsArray = [];
      media.forEach((item) => {
         const params = item.dataset[dataSetValue];
         const breakpoint = {};
         const paramsArray = params.split(",");
         breakpoint.value = paramsArray[0];
         breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
         breakpoint.item = item;
         breakpointsArray.push(breakpoint);
      });

      let mdQueries = breakpointsArray.map(function (item) {
         return (
            "(" +
            item.type +
            "-width: " +
            item.value +
            "px)," +
            item.value +
            "," +
            item.type
         );
      });

      mdQueries = uniqArray(mdQueries);
      const mdQueriesArray = [];

      if (mdQueries.length) {
         mdQueries.forEach((breakpoint) => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            const itemsArray = breakpointsArray.filter(function (item) {
               if (item.value === mediaBreakpoint && item.type === mediaType) {
                  return true;
               }
            });
            mdQueriesArray.push({
               itemsArray,
               matchMedia,
            });
         });
         return mdQueriesArray;
      }
   }
}

export function uniqArray(array) {
   return array.filter(function (item, index, self) {
      return self.indexOf(item) === index;
   });
}

// ===============================================================================================

export let isMobile = {
   Android: function () {
      return navigator.userAgent.match(/Android/i);
   },
   BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
   },
   iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
   },
   Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
   },
   Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
   },
   any: function () {
      return (
         isMobile.Android() ||
         isMobile.BlackBerry() ||
         isMobile.iOS() ||
         isMobile.Opera() ||
         isMobile.Windows()
      );
   },
};

export let bodyLockStatus = true;
