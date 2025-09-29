// @ts-ignore
import template from "./widget.html";
import toggle from "../../utils/toggle";
import { renderMenu } from "../menu/menu";
import { ISeinnaSettings } from "../../sienna";
import translateMenu from "../menu/translateMenu";

export function renderWidget(options: ISeinnaSettings) {
    let {
        position = "bottom-left",
        offset = [20, 20]
    } = options;

    const widget: HTMLElement = document.createElement("div");
    widget.innerHTML = template;
    widget.classList.add("asw-container");

    let $btn: HTMLElement = widget.querySelector(".asw-menu-btn");

    let offsetX = offset?.[0] ?? 20;
    let offsetY = offset?.[1] ?? 25;

    let buttonStyle: Partial<CSSStyleDeclaration> = {
        left: `${offsetX}px`,
        bottom: `${offsetY}px`,
        position: "fixed",
        cursor: "grab",
        zIndex: "9999"
    };

    if (position === "bottom-right") {
        buttonStyle = {
            ...buttonStyle,
            right: `${offsetX}px`,
            left: "auto"
        }
    } else if (position === "top-left") {
        buttonStyle = {
            ...buttonStyle,
            top: `${offsetY}px`,
            bottom: "auto"
        }
    } else if (position === "center-left") {
        buttonStyle = {
            ...buttonStyle,
            bottom: `calc(50% - (55px / 2) - ${offset?.[1] ?? 0}px)`
        }
    } else if (position === "top-right") {
        buttonStyle = {
            top: `${offsetY}px`,
            bottom: "auto",
            right: `${offsetX}px`,
            left: "auto"
        }
    } else if (position === "center-right") {
        buttonStyle = {
            right: `${offsetX}px`,
            left: "auto",
            bottom: `calc(50% - (55px / 2) - ${offset?.[1] ?? 0}px)`
        }
    } else if (position === "bottom-center") {
        buttonStyle = {
            ...buttonStyle,
            left: `calc(50% - (55px / 2) - ${offset?.[0] ?? 0}px)`
        }
    } else if (position === "top-center") {
        buttonStyle = {
            top: `${offsetY}px`,
            bottom: "auto",
            left: `calc(50% - (55px / 2) - ${offset?.[0] ?? 0}px)`
        }
    }

    Object.assign($btn.style, buttonStyle);

    let isDragging = false;
    let dragMoved = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    $btn.addEventListener("mousedown", (e) => {
        isDragging = true;
        dragMoved = false;
        dragOffsetX = e.clientX - $btn.getBoundingClientRect().left;
        dragOffsetY = e.clientY - $btn.getBoundingClientRect().top;
        $btn.style.transition = "none";
        $btn.style.cursor = "grabbing";

        // Switch to top/left mode so drag works correctly
        $btn.style.top = $btn.offsetTop + "px";
        $btn.style.left = $btn.offsetLeft + "px";
        $btn.style.right = "auto";
        $btn.style.bottom = "auto";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            dragMoved = true;
            $btn.style.left = e.clientX - dragOffsetX + "px";
            $btn.style.top = e.clientY - dragOffsetY + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            $btn.style.transition = "";
            $btn.style.cursor = "grab";
        }
    });

    let menu;
    $btn?.addEventListener("click", (event) => {
        if (!dragMoved) {
            event.preventDefault();
            if (menu) {
                toggle(menu);
            } else {
                menu = renderMenu({
                    ...options,
                    container: widget,
                });
            }
        }
    });

    translateMenu(widget);
    document.body.appendChild(widget);

    return widget;
}
