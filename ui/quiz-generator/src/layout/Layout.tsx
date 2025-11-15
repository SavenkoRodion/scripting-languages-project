import { useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

type SectionId = 'home' | 'quizzes' | 'add-quiz'

interface NavItem {
  name: string
  id: SectionId
}

const navigation: NavItem[] = [
  { name: 'Home', id: 'home' },
  { name: 'Show Quizzes', id: 'quizzes' },
  { name: 'Add Quiz', id: 'add-quiz' },
]

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function QuizAppLayout() {
  const [currentSection, setCurrentSection] = useState<SectionId>('home')

  const renderContent = () => {
    switch (currentSection) {
      case 'home':
        return (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Welcome to your quiz builder. Use this dashboard to create, manage, and play quizzes.
            </p>
            <p className="text-gray-600">
              Start by adding a new quiz, or review the list of existing quizzes. You can use this area to later plug in
              forms, tables, and quiz previews.
            </p>
          </div>
        )
      case 'quizzes':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Your quizzes</h2>
            <p className="text-gray-600">
              Here you can list all quizzes, add filters, search, and edit or delete them. For now, this is just a placeholder.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="font-medium text-gray-900">Example quiz: General Knowledge</h3>
                <p className="mt-1 text-sm text-gray-600">10 questions · Mixed difficulty</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="font-medium text-gray-900">Example quiz: History</h3>
                <p className="mt-1 text-sm text-gray-600">8 questions · Medium difficulty</p>
              </div>
            </div>
          </div>
        )
      case 'add-quiz':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Add a new quiz</h2>
            <p className="text-gray-600">
              This is a placeholder form. You can wire it to your state management or backend logic later.
            </p>
            <form className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Quiz title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
                  placeholder="e.g. JavaScript Basics"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
                  placeholder="Short description of this quiz"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save quiz
              </button>
            </form>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-full bg-gray-50">
      <Disclosure as="nav" className="border-b border-gray-200 bg-white">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex shrink-0 items-center">
                    <span className="text-lg font-semibold tracking-tight text-indigo-700">
                      Quiz Builder
                    </span>
                  </div>
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => {
                      const isCurrent = currentSection === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCurrentSection(item.id)}
                          aria-current={isCurrent ? 'page' : undefined}
                          className={classNames(
                            isCurrent
                              ? 'border-indigo-600 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                          )}
                        >
                          {item.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="-mr-2 flex items-center sm:hidden">
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600">
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className={classNames(!open && 'block', 'size-6 group-data-open:hidden')} />
                    <XMarkIcon aria-hidden="true" className={classNames(open && 'block', 'hidden size-6 group-data-open:block')} />
                  </DisclosureButton>
                </div>
              </div>
            </div>

            <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-3">
                {navigation.map((item) => {
                  const isCurrent = currentSection === item.id
                  return (
                    <DisclosureButton
                      key={item.id}
                      as="button"
                      type="button"
                      onClick={() => setCurrentSection(item.id)}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={classNames(
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                        'block w-full border-l-4 py-2 pr-4 pl-3 text-left text-base font-medium',
                      )}
                    >
                      {item.name}
                    </DisclosureButton>
                  )
                })}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {currentSection === 'home' && 'Dashboard'}
              {currentSection === 'quizzes' && 'Show Quizzes'}
              {currentSection === 'add-quiz' && 'Add Quiz'}
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
