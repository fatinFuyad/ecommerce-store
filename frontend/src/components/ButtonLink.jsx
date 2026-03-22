import { Link, NavLink } from "react-router-dom";

function ButtonLink({
  children,
  to,
  size = "medium",
  type = "primary",
  Icon,
  options = { linkType: "link" },
  ...props
}) {
  const color = options.color || "gray";
  const sizes = {
    large: "px-4 py-2",
    medium: "px-3 py-2",
    small: "px-2 py-1",
    text: "px-0 py-0"
  };

  const linkTypes = {
    primary: "bg-emerald-500 hover:bg-emerald-600",
    secondary: "bg-gray-500 hover:bg-gray-600",
    tertiary: "bg-cyan-500 hover:bg-cyan-600",
    simple: `text-${color}-300 hover:text-emerald-400 hover:underline`,
    custom: `bg-${options.color}-500 hover:bg-${options.color}-600`
  };

  let styles = `${linkTypes[type]} ${sizes[size]} rounded-md transition-colors duration-300 ease-in-out`;
  if (Icon) styles += " inline-flex justify-center items-center gap-[6px]";
  if (props.className) styles += ` ${props.className}`;

  return options.linkType === "navlink" ? (
    <NavLink className={styles} to={to}>
      {children} {children} {Icon && <Icon />}
    </NavLink>
  ) : (
    <Link className={styles} to={to}>
      {children}
      {Icon && (
        <Icon
          className={`${options.iconStyle || "size-5"}`}
          aria-hidden={true}
        />
      )}
    </Link>
  );
}

export default ButtonLink;
