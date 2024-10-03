interface ICopyIconProps {
  className?: string;
}

export const CopyIcon = ({ className }: ICopyIconProps) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.1662 3.11967V4.16711H13.5428L15.8345 6.45885V13.8333H16.8798L18 12.7132V3.11967L16.8798 1.99951H7.28636L6.1662 3.11967ZM15.8345 15.8333H17.7083L20 13.5416V2.29125L17.7083 -0.000488281H6.45794L4.1662 2.29125V4.16711H2.29247L0.000732422 6.45885V17.7092L2.29247 20.0009H13.5428L15.8345 17.7092V15.8333ZM2.00073 16.8808V7.28728L3.12089 6.16711H12.7144L13.8345 7.28728V16.8808L12.7144 18.0009H3.12089L2.00073 16.8808Z"
        fill="#0A3E50"
      />
    </svg>
  );
};
