const Footer: React.FC = () => {
  return (
    <footer className="sticky top-[100vh] bg-white">
      <div className="max-w-7xl mx-auto px-4 pb-8 sm:pt-4 xl:pt-8 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Внештата. Права пока не защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
