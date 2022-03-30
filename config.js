module.exports = {
	config: {
		tailwindjs: "./tailwind.config.js",
		port: 8080
	},
	paths: {
		root: "",
		src: {
			base: "assets",
			css: "assets/scss",
			js: "assets/js",
			img: "assets/img"
		},
		dist: {
			base: "assets/dist",
			css: "assets/dist/css",
			js: "assets/dist/js",
			img: "assets/dist/img"
		},
		build: {
			base: "assets/built",
			css: "assets/built/css",
			js: "assets/built/js",
			img: "assets/built/img"
		}
	}
}
