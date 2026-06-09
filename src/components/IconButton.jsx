export default function IconButton({ children, danger = false, small = true, ...props }) {
  return (
    <button className={`icon-button ${small ? "small" : ""} ${danger ? "danger-button" : ""}`} type="button" {...props}>
      {children}
    </button>
  );
}
