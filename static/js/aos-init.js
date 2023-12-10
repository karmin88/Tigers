AOS.init();
document.querySelectorAll('img').forEach((img) =>
    img.addEventListener('load', () =>
        AOS.refresh()
    )
);