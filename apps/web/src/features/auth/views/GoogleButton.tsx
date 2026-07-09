type GoogleButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

export function GoogleButton({ label, disabled, onClick }: GoogleButtonProps) {
  return (
    <button
      type="button"
      className="auth-simple-google"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <img src="/images/logos/google.svg" alt="" width={20} height={20} aria-hidden />
      <span>{label}</span>
    </button>
  );
}
