export default function Input(props) {
  const styles = `block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${props.disabled && "text-gray-300 cursor-not-allowed"}`;

  if (props.icon) {
    return (
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <props.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input {...props} className={styles} />
      </div>
    );
  }

  return <input {...props} className={styles} />;
}
