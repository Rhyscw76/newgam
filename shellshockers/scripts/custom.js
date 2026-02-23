/*

Custom script

This file will not be overwritten by the updater

*/

const getWindowLocationOrigin = window.location.origin + '/';


document.addEventListener("DOMContentLoaded", () => {
    const lazyImages = document.querySelectorAll("img.lazy-game");
    const gameThumbs = document.querySelectorAll('[data-video-thumb]');
    const gameContainerSingle = document.querySelector('.game-container-single');
	const singleGameContent = document.getElementById('single-game-content');
    let gameArea = gameContainerSingle ? document.getElementById('game-area') : null;


    const gameIframeHandler = (type) => {
        gameArea.contentWindow.postMessage(type, '*');
    }

	const checkIfGameRemoved = () => {
		if (singleGameContent && singleGameContent.classList.contains('game-removed')) {
			gameIframeHandler('gameRemoved');
		}
	}

	checkIfGameRemoved();


    const checkGameSingleUrl = async () => {
        if (gameContainerSingle) {
            const gameUrl = gameContainerSingle.getAttribute('data-game-url');
            let isReachable = await checkUrl(gameUrl);

            if (!isReachable) {
                gameArea.addEventListener('load', gameIframeHandler('gameBlocked'), { once: true });
                gameContainerSingle.classList.add("game-blocked");
                const similarGamesFooter = document.querySelector('.game-content-single-similar-footer');
                const similarGamesTop = document.querySelector('.game-content-single-similar-games');
				const title = document.querySelector('.single-title');
                const similarGamesTitle = similarGamesFooter.querySelector('.item-title');
                similarGamesTitle.textContent = `Looks like ${title.textContent} is unavailable! Try a similar game below:`;
                similarGamesTop.appendChild(similarGamesFooter);
            }
        }
    };

    const setupGameThumbListeners = () => {
        gameThumbs.forEach(game => {
            game.addEventListener('mouseenter', showVideoOnHoverListener);
            game.addEventListener('mouseleave', removeVideoChild);
        });
    };

    const loadImage = async (lazyImage) => {
        const parentElement = lazyImage.closest('[data-game-url]');
        const gameUrl = parentElement?.getAttribute('data-game-url');

        if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
        }

        if (gameUrl) {
            const isReachable = await checkUrl(gameUrl);
            if (!isReachable && parentElement) {
                parentElement.classList.add("game-blocked");
            }
        }

        lazyImage.classList.remove('lazy-game');
    };

    const intersectionObserverHandler = (entries, observer) => {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                await loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    };

    if ("IntersectionObserver" in window) {
        const lazyImageObserver = new IntersectionObserver(intersectionObserverHandler);
        lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage));
    } else {
        const lazyLoadFallback = () => {
            lazyImages.forEach(lazyImage => {
                const rect = lazyImage.getBoundingClientRect();
                if (rect.top <= window.innerHeight && rect.bottom >= 0 && getComputedStyle(lazyImage).display !== "none") {
                    loadImage(lazyImage);
                }
            });

            if (!lazyImages.length) {
                removeFallbackListeners();
            }
        };

        const removeFallbackListeners = () => {
            document.removeEventListener("scroll", lazyLoadFallback);
            window.removeEventListener("resize", lazyLoadFallback);
            window.removeEventListener("orientationchange", lazyLoadFallback);
        };

        document.addEventListener("scroll", lazyLoadFallback);
        window.addEventListener("resize", lazyLoadFallback);
        window.addEventListener("orientationchange", lazyLoadFallback);
    }

    const checkUrl = async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
            return response.type === 'opaque';
        } catch (error) {
            console.error(`Error fetching ${url}: ${error.message}`);
            return false;
        }
    };

    checkGameSingleUrl();
    setupGameThumbListeners();
});

function removeVideoChild(event) {
	const videoContainer = event.target.querySelector(".video-container");
	if (videoContainer) {
		videoContainer.remove();
	}
}

const showVideoOnHoverListener = (event) => {
	const elm = event.target;
	const thumb = elm.querySelector('.list-thumbnail');

	if (!thumb) return;

	const videoContainer = document.createElement("div");
	videoContainer.className = "video-container";
	videoContainer.style.width = `${thumb.offsetWidth}px`;
	videoContainer.style.height = `${thumb.offsetHeight}px`;

	const video = document.createElement("video");
	video.id = "myVideo";
	video.setAttribute("muted", "true");
	video.setAttribute("autoplay", "true");
	video.setAttribute("playsinline", "true");
	video.setAttribute("loop", "true");
	video.style.width = "100%";
	video.style.height = "auto";

	const source = document.createElement("source");
	source.src = `${document.location.origin}/files/videos/${elm.getAttribute('data-video-thumb')}.mp4`;
	source.type = "video/mp4";

	video.appendChild(source);
	videoContainer.appendChild(video);

	elm.appendChild(videoContainer);
};

// function checkForBlockedGame(url) {
// 	fetch(url, { method: 'HEAD' })
// 		.then(response => {
// 			if (response.ok) {
// 				console.log("The URL is accessible.");
// 			} else {
// 				console.log("The URL is blocked or unreachable.");
// 			}
// 		})
// 		.catch(error => {
// 			console.log("The URL is blocked or unreachable.");
// 		});
// }

// async function checkUrls(urls) {
// 	const promises = urls.map(url => checkUrl(url.url));
// 	const results = await Promise.all(promises);

// 	results.forEach((result, index) => {
// 		const gameUrl = urls[index];
// 		const gameElements = document.querySelectorAll(`[data-id="${gameUrl.id}"]`);
// 		gameElements.forEach(element => {
// 			if (!result) {
// 				element.classList.add('game-blocked');
// 			}
// 		});
// 	});
// }

// function checkUrl(url) {
// 	const path = getWindowLocationOrigin + 'content/themes/bluewizard-theme/proxy.php?url=' + encodeURIComponent(url);
// 	return fetch(path)
// 	.then(response => response.json())
// 	.then(data => {
// 		if (data.status >= 200 && data.status < 300) {
// 			return true;
// 		} else {
// 			console.error(`Failed to fetch ${url}: ${data.status}`);
// 			return false;
// 		}
// 	})
// 	.catch(error => {
// 		console.error(`Error fetching ${url}: ${error.message}`);
// 		return false;
// 	});
// }
