import { SVGProps } from 'react'

export const Copy = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="4 4 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 8.66667H8.66667V10H10V8.66667ZM10 11.3333H8.66667V12.6667H10V11.3333ZM10 6C9.26 6 8.66667 6.6 8.66667 7.33333H10V6ZM12.6667 14H11.3333V15.3333H12.6667V14ZM16.6667 6V7.33333H18C18 6.6 17.4 6 16.6667 6ZM12.6667 6H11.3333V7.33333H12.6667V6ZM10 15.3333V14H8.66667C8.66667 14.7333 9.26 15.3333 10 15.3333ZM16.6667 12.6667H18V11.3333H16.6667V12.6667ZM16.6667 10H18V8.66667H16.6667V10ZM16.6667 15.3333C17.4 15.3333 18 14.7333 18 14H16.6667V15.3333ZM7.33333 8.66667H6V16.6667C6 17.4 6.59333 18 7.33333 18H15.3333V16.6667H7.33333V8.66667ZM14 7.33333H15.3333V6H14V7.33333ZM14 15.3333H15.3333V14H14V15.3333Z"
        fill="currentColor"
      />
    </svg>
  )
}
