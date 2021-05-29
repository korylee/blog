module.exports = {
  "/docs/": [
    { title: "计算机基础", children: ["basis/", "basis/data-structure"] },
    {
      title: "JavaScript",
      // collapsable: false,
      children: [
        "js/",
        "js/es-object",
        "js/different-for-in-for-of",
        "js/execution-context",
        "js/closure",
        "js/eventLoop",
      ],
    },
    {
      title: "Vue",
      children: [
        "vue/",
        "vue/typescript-use",
        "vue/vue-hooks",
        "vue/composition-api",
        "vue/vue3-reactive"
      ],
    },
    {
      title: "HTTP",
      children: [
        "http/",
        "http/http-base",
        "http/http-cross-domain",
        "http/front-end-security",
      ],
    },
    {
      title: "Dom",
      children: [
        "dom/",
        "dom/IntersectionObserver",
        "dom/ResizeObserver",
      ],
    },
  ],
};
