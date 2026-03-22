export default function FormRow(props) {
  return (
    <div>
      {props.label && (
        <label
          htmlFor={props.id || ""}
          className="block text-sm font-medium text-gray-300"
        >
          {props.label}
        </label>
      )}

      {props.children}
    </div>
  );
}
