export const Loading = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        strokeWidth="3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeDashoffset="0"
        strokeDasharray="48, 96"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animate attributeName="stroke-dashoffset" values="0;-16;-60" dur="1.25s" repeatCount="indefinite" />
        <animate attributeName="stroke-dasharray" values="0,96;52.8,96;52.8,96" dur="1.25s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
