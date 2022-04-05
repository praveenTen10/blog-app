import Link from 'next/link'
import Image from 'next/image'
import Logo from '../public/images/mediumLogo.png'
function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <Image
            src={Logo}
            className="cursor-pointer object-contain"
            width={80}
            height={40}
            alt="logo"
          />
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex cursor-pointer">
          <h3>About</h3>
          <h3>Contact </h3>
          <h3 className="text-green-600 border rounded-full border-green-600 px-4 py-1">Follow</h3>
        </div>
      </div>
      <div className="text-green-600 flex items-center space-x-5 cursor-pointer">
          <h3>Sign In</h3>
          <h3 className="text-white bg-green-600 px-4 py-2 rounded-full">Get Started</h3>
      </div>
    </header>
  )
}

export default Header
