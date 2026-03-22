export default function Button({
  children,
  size = "medium",
  btnType = "primary",
  Icon,
  options = {},
  ...props
}) {
  const color = options.color || "gray";
  const sizes = {
    large: "px-6 py-3",
    medium: "px-4 py-2",
    small: "px-2 py-1",
    fluid: "w-full flex justify-center px-4 py-2 gap-2"
  };

  const buttonTypes = {
    primary: "bg-emerald-500 hover:bg-emerald-600",
    secondary: "bg-gray-500 hover:bg-gray-600",
    tertiary: "bg-cyan-500 hover:bg-cyan-600",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600",
    simple: `text-${color}-300 hover:text-emerald-400`,
    custom: `bg-${color}-500 hover:bg-${color}-600`
  };

  const focus = options?.animateFocus
    ? `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`
    : "";
  const transitions = `transition duration-300 ease-in-out disabled:opacity-50`;
  let styles = `${buttonTypes[btnType]} ${sizes[size]} border border-transparent rounded-md shadow-sm text-sm font-medium ${transitions} ${focus}`;

  if (options?.animateScale) {
    styles += ` hover:scale-110 tansition duration-300`;
  }

  if (Icon) styles += " inline-flex items-center justify-center gap-2";
  if (props.className) styles += " " + props.className;

  return (
    <button {...props} className={styles}>
      {children} {Icon && <Icon className={options.iconStyle || "h-5 w-5"} />}
    </button>
  );
}
