AOS.init({once:true});
document.querySelectorAll('img').forEach((img) =>
    img.addEventListener('load', () =>
        AOS.refresh()
    )
);