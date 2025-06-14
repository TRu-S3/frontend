'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Zap,
  Users,
  Code,
  Shield,
  Sparkles,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  Star,
  Database,
  MessageSquare,
  Clock,
  Search,
  CornerDownLeft,
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Page() {

  const { data: session } = useSession()
  if (session) {
    redirect('/dashboard')
  }

  const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const url = (e.target as HTMLInputElement).value
      if (url.trim()) {
        // Handle URL submission logic here
        console.log('Analyzing URL:', url)
      }
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-blue-50 to-white'>
      {/* Navigation */}
      <nav className='fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-blue-500/20 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-18'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20'>
                <Users className='w-6 h-6 text-white font-bold' />
              </div>
              <span className='text-2xl font-bold text-gray-900 tracking-tight'>SupaMatch.ai</span>
            </div>
            <div className='hidden md:flex space-x-10'>
              <a
                href='#features'
                className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
              >
                機能
              </a>
              <a
                href='#how-it-works'
                className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
              >
                使い方
              </a>
              <a
                href='#benefits'
                className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
              >
                メリット
              </a>
              <a
                href='#pricing'
                className='text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium'
              >
                料金
              </a>
            </div>
            <Link href='/signin'>
              <Button className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/20 px-6 py-2 text-white font-bold'>
                今すぐ始める
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='pt-36 pb-24 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <div className='relative'>
            <div className='absolute inset-0 blur-3xl opacity-20'>
              <div className='w-96 h-96 bg-blue-500/30 rounded-full mx-auto animate-pulse'></div>
            </div>
            <div className='relative'>
              <h1 className='text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight'>
                あなたを全て調べて
                <br />
                <span className='bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 bg-clip-text text-transparent'>
                  強力なエンジニア仲間
                </span>
                を発見
              </h1>
            </div>
          </div>

          {/* URL Input Demo */}
          <div className='max-w-3xl mx-auto mb-16'>
            <div className='relative'>
              <div className='flex items-center gap-4 p-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-500/30 shadow-xl shadow-blue-500/10'>
                <Search className='w-6 h-6 text-gray-400 ml-6' />
                <input
                  type='text'
                  placeholder='GitHub、Twitter、ポートフォリオサイトのURL を入力'
                  className='flex-1 bg-transparent border-0 px-6 py-4 text-gray-900 text-lg placeholder-gray-500 focus:outline-none focus:ring-0'
                  onKeyDown={handleUrlSubmit}
                />
                <div className='flex items-center space-x-2 mr-6 px-3 py-2 bg-blue-50 rounded-full'>
                  <CornerDownLeft className='w-4 h-4 text-blue-600' />
                  <span className='text-sm font-medium text-blue-600'>Enter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className='flex flex-wrap justify-center items-center gap-10 opacity-80'>
            <div className='flex items-center space-x-2'>
              <Star className='w-5 h-5 text-blue-500' />
              <span className='text-blue-600 font-bold'>4.9/5</span>
            </div>
            <div className='text-blue-600 font-bold'>1,000+ エンジニア</div>
            <div className='text-blue-600 font-bold'>99.9% 稼働率</div>
            <div className='text-blue-600 font-bold'>平均3分でマッチング</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-24 px-4 sm:px-6 lg:px-8 bg-gray-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight'>
              <span className='text-blue-600'>スマート</span>な革新的機能
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto font-medium'>
              最先端の技術でエンジニア同士の
              <span className='text-blue-600 font-bold'>最適なマッチング</span>を実現
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='bg-white rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 shadow-sm'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg'>
                <Code className='w-6 h-6 text-white font-bold' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>プロフィール自動分析</h3>
              <p className='text-gray-600'>
                GitHub、LinkedIn、個人サイトから技術スタック、経験年数、プロジェクト実績を自動解析
              </p>
            </div>

            <div className='bg-white rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 shadow-sm'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg'>
                <Users className='w-6 h-6 text-white font-bold' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>スマートマッチング</h3>
              <p className='text-gray-600'>
                技術的相性、経験レベル、プロジェクト志向性を考慮した高精度マッチングアルゴリズム
              </p>
            </div>

            <div className='bg-white rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 shadow-sm'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg'>
                <Zap className='w-6 h-6 text-white font-bold' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>リアルタイム分析</h3>
              <p className='text-gray-600'>
                最新のコミット、プロジェクト更新、スキル変化をリアルタイムで追跡・反映
              </p>
            </div>

            <div className='bg-white rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 shadow-sm'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg'>
                <Database className='w-6 h-6 text-white font-bold' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>コード品質評価</h3>
              <p className='text-gray-600'>
                コーディングスタイル、アーキテクチャ設計、ベストプラクティスの遵守度を自動評価
              </p>
            </div>

            <div className='bg-white rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 shadow-sm'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg'>
                <Shield className='w-6 h-6 text-white font-bold' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>プライバシー保護</h3>
              <p className='text-gray-600'>
                エンドツーエンド暗号化とプライバシーファーストの設計で安全な情報共有
              </p>
            </div>

            <div className='bg-white rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 shadow-sm'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg'>
                <Sparkles className='w-6 h-6 text-white font-bold' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>パーソナライゼーション</h3>
              <p className='text-gray-600'>
                個人の学習パターンと成長軌跡を分析し、最適なキャリアパスを提案
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id='how-it-works' className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>3ステップで始める</h2>
            <p className='text-xl text-gray-600'>シンプルで直感的なプロセス</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8 mb-16'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-2xl font-bold text-white'>1</span>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>URLを入力</h3>
              <p className='text-gray-600'>
                GitHubプロフィール、LinkedIn、個人サイトなど、あなたの技術的背景が分かるURLを入力
              </p>
            </div>

            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-2xl font-bold text-white'>2</span>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>自動分析実行</h3>
              <p className='text-gray-600'>
                高度なシステムがあなたのスキル、経験、プロジェクト履歴を包括的に分析・評価
              </p>
            </div>

            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-2xl font-bold text-white'>3</span>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>マッチング開始</h3>
              <p className='text-gray-600'>
                相性の良いエンジニアとの出会いが始まり、協業やネットワーキングの機会を獲得
              </p>
            </div>
          </div>

          {/* Demo Video Placeholder */}
          <div className='bg-white rounded-2xl p-12 border border-blue-500/20 text-center shadow-lg'>
            <div className='w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6'>
              <div className='w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1'></div>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>実際の分析プロセスを見る</h3>
            <p className='text-gray-600 mb-6'>
              2分間のデモビデオで、分析からマッチングまでの流れを確認できます
            </p>
            <Button
              size='lg'
              variant='outline'
              className='border-blue-500/50 text-blue-600 hover:bg-blue-500/10'
            >
              デモビデオを再生
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id='benefits' className='py-20 px-4 sm:px-6 lg:px-8 bg-gray-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              なぜSupaMatch.aiなのか
            </h2>
            <p className='text-xl text-gray-600'>従来のマッチングサービスを超える価値</p>
          </div>

          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div>
              <div className='space-y-8'>
                <div className='flex items-start space-x-4'>
                  <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <CheckCircle className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>95%の高精度マッチング</h3>
                    <p className='text-gray-600'>
                      詳細な分析により、技術的相性から性格的適合性まで総合的に判断
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <Clock className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                      平均3分でマッチング完了
                    </h3>
                    <p className='text-gray-600'>
                      従来の手動プロフィール作成から解放、瞬時に最適な相手を発見
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <Database className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                      継続的なプロフィール更新
                    </h3>
                    <p className='text-gray-600'>
                      リアルタイムでスキルセットと経験を追跡、常に最新状態を維持
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <MessageSquare className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                      スマートコミュニケーション支援
                    </h3>
                    <p className='text-gray-600'>
                      共通の技術的興味やプロジェクト経験を基にした会話の提案
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-3xl p-8 border border-blue-500/20 shadow-lg'>
              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>今月の成果</h3>
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-blue-600 mb-2'>1,247</div>
                  <div className='text-gray-600'>新規マッチング</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-blue-600 mb-2'>89%</div>
                  <div className='text-gray-600'>満足度</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-blue-600 mb-2'>156</div>
                  <div className='text-gray-600'>プロジェクト開始</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-blue-600 mb-2'>2.3分</div>
                  <div className='text-gray-600'>平均分析時間</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id='pricing' className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              シンプルな料金体系
            </h2>
            <p className='text-xl text-gray-600'>あなたのニーズに合わせた柔軟なプラン</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-white rounded-2xl p-8 border border-gray-200 shadow-lg'>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>ベーシック</h3>
              <div className='text-3xl font-bold text-gray-900 mb-6'>無料</div>
              <ul className='space-y-3 mb-8'>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  月3回のプロフィール分析
                </li>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  基本マッチング機能
                </li>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  コミュニティアクセス
                </li>
              </ul>
              <Button
                className='w-full border-blue-500/50 text-blue-600 hover:bg-blue-500/10'
                variant='outline'
              >
                始める
              </Button>
            </div>

            <div className='bg-white rounded-2xl p-8 border-2 border-blue-500 relative shadow-xl'>
              <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                <span className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold'>
                  人気
                </span>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>プロ</h3>
              <div className='text-3xl font-bold text-gray-900 mb-6'>
                ¥2,980
                <span className='text-lg text-gray-600'>/月</span>
              </div>
              <ul className='space-y-3 mb-8'>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  無制限のプロフィール分析
                </li>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  高度なマッチングアルゴリズム
                </li>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  プライオリティサポート
                </li>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  詳細な適合性レポート
                </li>
              </ul>
              <Button className='w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white'>
                始める
              </Button>
            </div>

            <div className='bg-white rounded-2xl p-8 border border-gray-200 shadow-lg'>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>エンタープライズ</h3>
              <div className='text-3xl font-bold text-gray-900 mb-6'>カスタム</div>
              <ul className='space-y-3 mb-8'>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  チーム向け一括管理
                </li>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  カスタムAPI統合
                </li>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  専任サポート
                </li>
                <li className='flex items-center text-gray-600'>
                  <CheckCircle className='w-5 h-5 text-blue-500 mr-3' />
                  SLAとセキュリティ保証
                </li>
              </ul>
              <Button
                className='w-full border-blue-500/50 text-blue-600 hover:bg-blue-500/10'
                variant='outline'
              >
                相談する
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8 bg-gray-50'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
            今すぐスマートマッチングを体験
          </h2>
          <p className='text-xl text-gray-600 mb-8'>数分で理想のエンジニアパートナーと出会えます</p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              size='lg'
              className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-lg px-8 py-4 text-white'
            >
              無料で始める <ArrowRight className='ml-2 w-5 h-5' />
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='border-blue-500/50 text-blue-600 hover:bg-blue-500/10 text-lg px-8 py-4'
            >
              デモをリクエスト
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center'>
                  <Users className='w-5 h-5 text-white' />
                </div>
                <span className='text-xl font-bold text-gray-900'>SupaMatch</span>
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

            <div>
              <h4 className='text-gray-900 font-semibold mb-4'>プロダクト</h4>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    機能
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    料金
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    API
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    統合
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='text-gray-900 font-semibold mb-4'>サポート</h4>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    ヘルプセンター
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    お問い合わせ
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    コミュニティ
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    ステータス
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='text-gray-900 font-semibold mb-4'>企業情報</h4>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    会社概要
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    ブログ
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    採用情報
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    プライバシー
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-200 mt-12 pt-8 text-center text-gray-600'>
            <p>&copy; 2024 SupaMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
