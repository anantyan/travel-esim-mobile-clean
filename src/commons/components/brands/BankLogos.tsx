export function BcaLogo() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-testid="bank-logo-BCA_VA"
      viewBox="0 0 88 28"
      className="h-6 w-auto shrink-0"
    >
      {/* Stylized BCA lotus/clover emblem */}
      <g transform="translate(2, 4)">
        <circle cx="10" cy="10" r="9.5" fill="#005BAA" />
        <path
          d="M10 3.2C8.1 5.1 8.1 7.8 10 9.4C11.9 7.8 11.9 5.1 10 3.2Z"
          fill="#FFFFFF"
        />
        <path
          d="M10 16.8C8.1 14.9 8.1 12.2 10 10.6C11.9 12.2 11.9 14.9 10 16.8Z"
          fill="#FFFFFF"
        />
        <path
          d="M3.2 10C5.1 8.1 7.8 8.1 9.4 10C7.8 11.9 5.1 11.9 3.2 10Z"
          fill="#FFFFFF"
        />
        <path
          d="M16.8 10C14.9 8.1 12.2 8.1 10.6 10C12.2 11.9 14.9 11.9 16.8 10Z"
          fill="#FFFFFF"
        />
      </g>
      <text
        x="26"
        y="20"
        fill="#005BAA"
        fontFamily="Plus Jakarta Sans Variable, system-ui, sans-serif"
        fontSize="16"
        fontWeight="900"
        fontStyle="italic"
        letterSpacing="-0.4"
      >
        BCA
      </text>
    </svg>
  );
}

export function MandiriLogo() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-testid="bank-logo-MANDIRI_VA"
      viewBox="0 0 96 28"
      className="h-6 w-auto shrink-0"
    >
      {/* Golden wave ribbon above wordmark */}
      <path
        d="M34 6.5C44 2.2 56 2.2 66 5.8C73 8.2 81 8.2 89 4.2C83 9.2 73 10.6 64 8.2C54 5.5 44 5.5 34 6.5Z"
        fill="#FDB913"
      />
      <text
        x="2"
        y="22"
        fill="#003D79"
        fontFamily="Plus Jakarta Sans Variable, system-ui, sans-serif"
        fontSize="16"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        mandiri
      </text>
    </svg>
  );
}

export function BriLogo() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-testid="bank-logo-BRI_VA"
      viewBox="0 0 84 28"
      className="h-6 w-auto shrink-0"
    >
      {/* Rounded-square BRI monogram crest */}
      <rect x="2" y="4" width="20" height="20" rx="4.5" fill="#00529C" />
      <path
        d="M7.5 8.5H13.2C15.1 8.5 16.2 9.4 16.2 10.9C16.2 12.1 15.4 12.9 14.3 13.2C15.6 13.5 16.5 14.4 16.5 15.8C16.5 17.6 15.1 18.7 13 18.7H7.5V8.5ZM10.1 12.4H12.7C13.5 12.4 13.9 12 13.9 11.4C13.9 10.7 13.5 10.4 12.7 10.4H10.1V12.4ZM10.1 16.8H12.9C13.8 16.8 14.2 16.4 14.2 15.6C14.2 14.9 13.8 14.4 12.9 14.4H10.1V16.8Z"
        fill="#FFFFFF"
      />
      <text
        x="27"
        y="20"
        fill="#00529C"
        fontFamily="Plus Jakarta Sans Variable, system-ui, sans-serif"
        fontSize="16"
        fontWeight="900"
        letterSpacing="0.2"
      >
        BRI
      </text>
    </svg>
  );
}
