import * as React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShadcnButtonProps = React.ComponentProps<typeof ShadcnButton>;

export type ButtonType = "primary" | "default" | "dashed" | "text" | "link";

export interface ButtonProps
	extends Omit<ShadcnButtonProps, "type" | "variant"> {
	/**
	 * 按钮类型
	 * - primary: 主按钮
	 * - default: 默认按钮 (描边)
	 * - dashed: 虚线按钮
	 * - text: 文本按钮
	 * - link: 链接按钮
	 */
	type?: ButtonType;
	/**
	 * 是否为危险按钮
	 */
	danger?: boolean;
	/**
	 * 原生按钮类型
	 */
	htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, type = "default", danger, htmlType, size, children, ...props },
		ref,
	) => {
		const defaultHtmlType =
			htmlType || (type === "primary" ? "submit" : "button");

		// 计算样式类
		const getStyleClasses = () => {
			// 类型样式
			let typeClasses = "";
			switch (type) {
				case "primary":
					if (danger) {
						// 原 Submit 样式
						typeClasses =
							"bg-danger text-white hover:text-white hover:bg-danger/90 shadow-none border-transparent";
					} else {
						// 原 Confirm 样式
						typeClasses =
							"bg-neutral-950 text-white hover:text-white hover:bg-neutral-950/90 shadow-none border-transparent";
					}
					break;
				case "default":
					if (danger) {
						// 原 Reset 样式
						typeClasses =
							"bg-white border border-danger text-danger hover:text-danger hover:bg-danger-bg shadow-none";
					} else {
						// 原 Cancel 样式
						typeClasses =
							"bg-white border border-neutral-200 text-neutral-800 hover:text-neutral-800 hover:bg-neutral-50 shadow-none";
					}
					break;
				case "dashed":
					if (danger) {
						typeClasses =
							"bg-white border border-dashed border-danger text-danger hover:text-danger hover:bg-danger-bg shadow-none";
					} else {
						typeClasses =
							"bg-white border border-dashed border-neutral-200 text-neutral-800 hover:text-neutral-800 hover:bg-neutral-50 shadow-none";
					}
					break;
				case "text":
					if (danger) {
						typeClasses =
							"bg-transparent text-danger hover:text-danger hover:bg-danger-bg shadow-none";
					} else {
						typeClasses =
							"bg-transparent text-neutral-800 hover:text-neutral-800 hover:bg-neutral-50 shadow-none";
					}
					break;
				case "link":
					if (danger) {
						typeClasses =
							"bg-transparent text-danger hover:text-danger underline-offset-4 hover:underline shadow-none";
					} else {
						typeClasses =
							"bg-transparent text-neutral-950 hover:text-neutral-950 underline-offset-4 hover:underline shadow-none";
					}
					break;
			}

			return typeClasses;
		};

		// 映射 shadcn variant 主要是为了兼容性，但我们的自定义样式会覆盖它
		// 我们使用 variant="default" (shadcn default) 作为基础，然后覆盖
		// 对于 ghost 和 link，我们可以利用 shadcn 的 variant 行为，但这里为了完全控制，全部自定义比较安全

		// 只有在没有指定特定 size 时才应用默认的固定宽度和高度样式
		// 这样当传入 size="sm" 等属性时，可以正确应用 shadcn 的尺寸样式
		const isDefaultSize = !size || size === "default";

		return (
			<ShadcnButton
				ref={ref}
				type={defaultHtmlType}
				size={size}
				// 为了避免 shadcn 默认样式干扰（特别是 bg-primary），我们可以使用 variant="ghost" 或 "outline" 作为基底，
				// 或者直接用 className 强行覆盖。
				// 使用 variant="ghost" 比较干净，因为它没有背景和边框，容易覆盖。
				variant="ghost"
				className={cn(
					"cursor-pointer rounded-6",
					isDefaultSize && "h-auto min-w-[120px] py-3",
					getStyleClasses(),
					className,
				)}
				{...props}
			>
				{children}
			</ShadcnButton>
		);
	},
);
Button.displayName = "Button";

export { Button };
