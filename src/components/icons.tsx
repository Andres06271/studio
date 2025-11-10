import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://wwwABC.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="currentColor"
        d="M168 40h-80a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h80a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm-88 16v144h-8a16 16 0 0 1-16-16V72a16 16 0 0 1 16-16Zm128 144v8a16 16 0 0 1-16 16h-8V56h8a16 16 0 0 1 16 16Z"
        opacity={0.2}
      />
      <path
        fill="currentColor"
        d="M168 32h-80a24 24 0 0 0-24 24v144a24 24 0 0 0 24 24h80a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24Zm8 168a8 8 0 0 1-8 8h-80a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8Z"
      />
    </svg>
  ),
};
