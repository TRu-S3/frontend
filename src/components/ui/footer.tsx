import { Users, Twitter, Github, Linkedin } from 'lucide-react'
export default function Footer() {
  return (
    <footer className='py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid md:grid-cols-4 gap-8'>
          <div>
            <div className='flex items-center space-x-2 mb-4'>
              <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center'>
                <Users className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold text-gray-900'>UltraSoulMatch.ai</span>
            </div>
            <p className='text-gray-600 mb-4'>
              スマートな技術でエンジニア同士の最適なマッチングを実現する次世代プラットフォーム
            </p>
            <div className='flex space-x-4'>
              <a href='#' className='text-gray-400 hover:text-blue-600 transition-colors'>
                <Twitter className='w-5 h-5' />
              </a>
              <a href='#' className='text-gray-400 hover:text-blue-600 transition-colors'>
                <Github className='w-5 h-5' />
              </a>
              <a href='#' className='text-gray-400 hover:text-blue-600 transition-colors'>
                <Linkedin className='w-5 h-5' />
              </a>
            </div>
          </div>
        </div>

        <div className='border-t border-gray-200 mt-12 pt-8 text-center text-gray-600'>
          <p>&copy; 2025 UltraSoulMatch.ai All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
