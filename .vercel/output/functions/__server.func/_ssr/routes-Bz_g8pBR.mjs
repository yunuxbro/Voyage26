import { o as __toESM } from "../_runtime.mjs";
import { H as require_react, S as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as formatInr } from "./utils-Dw4aI9KJ.mjs";
import { c as ChevronDown, l as Anchor, n as Users, o as Flag, s as Compass } from "../_libs/lucide-react.mjs";
import { d as CompassRose, f as RopeDivider, l as useCart, o as Route$8, p as SeaWaves, s as Button } from "./router-BRS1F0Tu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bz_g8pBR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function split(target, now) {
	const diff = target.getTime() - now.getTime();
	if (diff <= 0) return {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		past: true
	};
	const total = Math.floor(diff / 1e3);
	return {
		days: Math.floor(total / 86400),
		hours: Math.floor(total % 86400 / 3600),
		minutes: Math.floor(total % 3600 / 60),
		seconds: total % 60,
		past: false
	};
}
function Cell({ value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-[4.5rem] rounded-[16px] bg-ink/55 px-3 py-3 shadow-[0_0_0_1px_rgb(201_164_76_/_0.28)] sm:min-w-[5.5rem] sm:px-4 sm:py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-3xl text-gold tabular-nums sm:text-4xl",
			children: String(value).padStart(2, "0")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-[0.65rem] tracking-[0.22em] text-muted uppercase",
			children: label
		})]
	});
}
function Countdown({ iso }) {
	const target = new Date(iso);
	const [parts, setParts] = (0, import_react.useState)({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		past: false
	});
	(0, import_react.useEffect)(() => {
		const tick = () => setParts(split(target, /* @__PURE__ */ new Date()));
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, [target]);
	if (Number.isNaN(target.getTime())) return null;
	if (parts.past) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-display tracking-[0.18em] text-gold",
		children: "The fleet is in harbour."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-3 text-[0.7rem] tracking-[0.28em] text-gold/80 uppercase",
		children: "First gun in"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap justify-center gap-2 sm:gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				value: parts.days,
				label: "Days"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				value: parts.hours,
				label: "Hours"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				value: parts.minutes,
				label: "Minutes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
				value: parts.seconds,
				label: "Seconds"
			})
		]
	})] });
}
function Hero({ site }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative min-h-[100dvh] overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-sea absolute inset-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fog-sheet" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fog-drift" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeaWaves, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-4 pb-24 pt-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.72rem] tracking-[0.32em] text-gold uppercase drop-shadow-lg",
							children: "AIESEC in IIT presents"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "gold-title font-display mt-4 text-display leading-[0.95] tracking-display uppercase drop-shadow-2xl",
							children: ["Voyage", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-[0.55em] tracking-[0.22em] text-parchment drop-shadow-lg",
								children: "'26"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-5 max-w-xl text-base leading-relaxed text-gold-2 sm:text-lg drop-shadow-2xl",
							style: { textShadow: "0 0 4px rgba(0, 0, 0, 1), 0 4px 12px rgba(0, 0, 0, 0.95), 0 8px 20px rgba(0, 0, 0, 0.8)" },
							children: site.tagline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gold-2 sm:text-base drop-shadow-2xl",
							style: { textShadow: "0 0 4px rgba(0, 0, 0, 1), 0 4px 12px rgba(0, 0, 0, 0.95), 0 8px 20px rgba(0, 0, 0, 0.8)" },
							children: site.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { iso: site.event_starts_at })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs tracking-[0.2em] text-parchment uppercase drop-shadow-md",
							children: site.venue
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									className: "min-w-44",
									children: "Register"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									variant: "outline",
									className: "min-w-44",
									children: "Ship's store"
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#log",
					className: "mt-12 inline-flex flex-col items-center gap-1 text-[0.65rem] tracking-[0.28em] text-gold/70 uppercase",
					children: ["Descend", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompassRose, { className: "compass-spin pointer-events-none absolute right-6 bottom-28 hidden size-16 opacity-70 md:block" })
		]
	});
}
function MapVoyage() {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const onScroll = () => {
			const rect = el.getBoundingClientRect();
			const start = window.innerHeight * .85;
			const end = -rect.height * .15;
			const t = (start - rect.top) / (start - end);
			const progress = Math.min(1, Math.max(0, t));
			el.style.setProperty("--map-progress", String(progress));
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref,
		className: "relative overflow-hidden border-y border-gold/15 bg-ink-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-40",
				style: {
					backgroundImage: "url(/images/gallery-map.jpg)",
					backgroundSize: "cover",
					backgroundPosition: `center calc(40% + (var(--scrolly, 0) * 0.04px))`
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/55" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-[0.7rem] tracking-[0.28em] text-gold uppercase",
						children: "The crossing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-center text-display-sm text-parchment",
						children: "Four watches. One crew."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto mt-10 h-56 max-w-3xl sm:h-72",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 120 90",
								className: "h-full w-full text-gold/50",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M 8 72 C 28 18, 52 92, 78 36 S 108 8, 92 60",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "0.7",
										strokeDasharray: "2 2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "8",
										cy: "72",
										r: "1.6",
										fill: "currentColor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "92",
										cy: "60",
										r: "1.6",
										fill: "currentColor"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "map-ship pointer-events-none absolute top-0 left-0 size-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 32 32",
									className: "size-8 text-gold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M4 22 L16 8 L28 22 L16 18 Z",
										fill: "currentColor"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "absolute bottom-2 left-0 text-[0.65rem] tracking-[0.2em] text-muted uppercase",
								children: "Home port"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "absolute right-0 bottom-8 text-[0.65rem] tracking-[0.2em] text-muted uppercase",
								children: "Treasure harbour"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted",
						children: "Scroll the chart. The flagship answers the helm — down the page to sail out, back up to return to port. Same as the old films: the sea never forgets which way you came."
					})
				]
			})
		]
	});
}
var pillars = [
	{
		icon: Compass,
		title: "Compass",
		copy: "Know your heading. Labs on self-leadership, values under fog, and the decisions you will still defend at dawn."
	},
	{
		icon: Users,
		title: "Crew",
		copy: "Eight to a boat. You will lead people you did not choose — the only kind of leadership that counts."
	},
	{
		icon: Flag,
		title: "Command",
		copy: "Give the order. Take the order. Rotate the wheel until rank feels like responsibility, not costume."
	},
	{
		icon: Anchor,
		title: "Harbour",
		copy: "Leave with a commission, a crew you would sail with again, and a log of the day you actually changed."
	}
];
function About({ site }) {
	const paragraphs = site.about_text.split(/\n\n+/);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "log",
		className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RopeDivider, { className: "mb-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
				children: "Ship's log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display mt-2 max-w-2xl text-display-sm text-parchment",
				children: [site.event_title, " is not a conference. It is a crossing."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4 text-base leading-relaxed text-muted",
					children: paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 24)))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-[24px] bg-wood p-6 shadow-[0_0_0_1px_rgb(201_164_76_/_0.22)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.7rem] tracking-[0.22em] text-gold uppercase",
							children: "Port of call"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-xl text-parchment",
							children: site.venue
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-muted",
							children: "One day. Five watches. Crews of eight. Commissioned by AIESEC in IIT for students who would rather take the wheel than watch the weather."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "mt-6 inline-block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Take a berth" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: pillars.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-[20px] bg-ink-2 p-5 shadow-[0_0_0_1px_rgb(201_164_76_/_0.16)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 text-gold" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 font-display text-lg text-gold",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: item.copy
						})
					]
				}, item.title))
			})
		]
	});
}
function Schedule({ sessions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-ink-2/80",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
					children: "The watches"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-display-sm text-parchment",
					children: "A day written like a ship's log"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-10 space-y-4",
					children: sessions.map((session, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "grid gap-3 rounded-[20px] bg-wood px-5 py-5 shadow-[0_0_0_1px_rgb(201_164_76_/_0.16)] sm:grid-cols-[8rem_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[0.65rem] tracking-[0.2em] text-gold uppercase",
							children: [
								String(index + 1).padStart(2, "0"),
								" · ",
								session.day_label
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted tabular-nums",
							children: session.time_label
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg text-parchment",
							children: session.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted",
							children: session.description
						})] })]
					}, session.id))
				})
			]
		})
	});
}
function Gallery({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
				children: "Spyglass"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-2 text-display-sm text-parchment",
				children: "From last year's crossing Voyage '25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
					className: i === 0 ? "sm:col-span-2 lg:col-span-2 overflow-hidden rounded-[24px]" : "overflow-hidden rounded-[20px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.image_url,
						alt: item.caption,
						className: "framed h-64 w-full object-cover sm:h-72"
					})
				}, item.id))
			})
		]
	});
}
function StoreTeaser({ products }) {
	const add = useCart((s) => s.add);
	const featured = products.slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-gold/15 bg-wood",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
					children: "Ship's store"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-display-sm text-parchment",
					children: "Kit for the crossing"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "All cargo"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-5 sm:grid-cols-3",
				children: featured.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "overflow-hidden rounded-[24px] bg-ink-2 shadow-[0_0_0_1px_rgb(201_164_76_/_0.18)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image_url,
						alt: product.name,
						className: "framed h-56 w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-parchment",
								children: product.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-gold tabular-nums",
								children: formatInr(product.price_cents)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "mt-3 w-full",
								onClick: () => add({
									productId: product.id,
									name: product.name,
									priceCents: product.price_cents,
									imageUrl: product.image_url
								}),
								children: "Add to hold"
							})
						]
					})]
				}, product.id))
			})]
		})
	});
}
function FinalCall({ site }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/hero-galleon.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover opacity-35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[0.7rem] tracking-[0.28em] text-gold uppercase",
						children: "All hands"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-3 text-display-sm text-parchment",
						children: "Berths are finite. The tide is not waiting."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: site.venue
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								children: "Register as delegate"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								children: "Browse the store"
							})
						})]
					})
				]
			})
		]
	});
}
function Home() {
	const { site, products, gallery, sessions } = Route$8.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, { site }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapVoyage, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, { site }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Schedule, { sessions }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, { items: gallery }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreTeaser, { products }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCall, { site })
	] });
}
//#endregion
export { Home as component };
