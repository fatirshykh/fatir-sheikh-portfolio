"use strict";
// A small enhancement layer: the entire portfolio remains readable without JavaScript.
document.documentElement.classList.add("js");
const menu = document.querySelector("[data-menu-toggle]");
const mobileLinks = document.querySelector("[data-mobile-links]");
if (menu && mobileLinks) {
  function closeMenu() {
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
    mobileLinks.classList.remove("open");
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    mobileLinks.classList.toggle("open", open);
  });
  mobileLinks
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !mobileLinks.contains(e.target))
      closeMenu();
  });
}
const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
const progress = document.querySelector("[data-progress]");
const header = document.querySelector(".site-header");
function updateScroll() {
  if (progress) {
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width =
      (h > 0 ? Math.min(100, (scrollY / h) * 100) : 0) + "%";
  }
  header?.classList.toggle("is-scrolled", scrollY > 8);
}
addEventListener("scroll", updateScroll, { passive: true });
updateScroll();
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduced && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.09, rootMargin: "0px 0px -25px 0px" },
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
} else {
  document
    .querySelectorAll("[data-reveal]")
    .forEach((el) => el.classList.add("is-visible"));
}
// The portrait is a real asset from the existing portfolio repository, not a generated image.
document.querySelectorAll("[data-portrait]").forEach((img) => {
  img.addEventListener("error", () => img.classList.add("has-error"));
  if (img.complete && !img.naturalWidth) img.classList.add("has-error");
});

// Fatir portfolio: public GitHub API data; no credentials or private code.
(function(){
 const list=document.querySelector('[data-github-list]');
 const count=document.querySelector('[data-github-count]');
 const status=document.querySelector('[data-github-status]');
 if(!list||!count)return;
 const base='https://api.github.com/users/fatirshykh';
 Promise.all([
  fetch(base).then(r=>{if(!r.ok)throw Error('profile');return r.json();}),
  fetch(base+'/repos?per_page=100&sort=pushed&direction=desc').then(r=>{if(!r.ok)throw Error('repositories');return r.json();})
 ]).then(([profile,repos])=>{
  count.textContent=String(profile.public_repos);
  status.textContent='Live public data';
  const safe=Array.isArray(repos)?repos.filter(r=>!r.private&&!r.fork&&typeof r.html_url==='string'&&/^https:\/\/github\.com\/fatirshykh\/[^/]+$/.test(r.html_url)):[];
  if(!safe.length)return;
  const fragment=document.createDocumentFragment();
  safe.slice(0,8).forEach(repo=>{
    const a=document.createElement('a'); a.href=repo.html_url; a.target='_blank'; a.rel='noopener noreferrer';
    a.textContent=repo.name+' ↗'; fragment.append(a);
  });
  list.replaceChildren(fragment);
 }).catch(()=>{status.textContent='Showing saved public links';});
})();
