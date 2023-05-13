import type { Companies } from '@prisma/client'
import Image from 'next/image'
import { Fragment } from 'react'
import { FaVk, FaYandex } from 'react-icons/fa'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const convertCompany = (company: Companies) => {
  switch (company) {
    case 'AlfaBank':
      return 'Альфа-Банк'
    case 'MTS':
      return 'МТС'
    case 'Rostelecom':
      return 'Ростелеком'
    case 'Sber':
      return 'Сбербанк'
    case 'Tinkoff':
      return 'Тинькофф'
    case 'VK':
      return 'ВКонтакте'
    case 'Yandex':
      return 'Яндекс'
  }
}

const convertIcon = (company: Companies) => {
  switch (company) {
    case 'AlfaBank':
      return (
        <span
          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-[#ef3124]`}
        >
          <Image
            className="w-5 h-5"
            aria-hidden="true"
            src="/company-logos/alfabank.svg"
            alt="Лого"
            width={16}
            height={16}
          />
        </span>
      )
    case 'MTS':
      return (
        <span
          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-[#e40422]`}
        >
          <Image
            className="w-5 h-5 text-white"
            aria-hidden="true"
            src="/company-logos/mts.svg"
            alt="Лого"
            width={16}
            height={16}
          />
        </span>
      )
    case 'Rostelecom':
      return (
        <span
          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white`}
        >
          <Image
            className="w-7 h-7 text-white"
            aria-hidden="true"
            src="/company-logos/rostelecom.svg"
            alt="Лого"
            width={16}
            height={16}
          />
        </span>
      )
    case 'Sber':
      return (
        <span
          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white`}
        >
          <Image
            className="w-8 h-8 text-white"
            aria-hidden="true"
            src="/company-logos/sber.svg"
            alt="Лого"
            width={16}
            height={16}
          />
        </span>
      )
    case 'Tinkoff':
      return (
        <span
          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-[#ffdd2e]`}
        >
          <Image
            className="w-6 h-6 text-white"
            aria-hidden="true"
            src="/company-logos/tinkoff.svg"
            alt="Лого"
            width={16}
            height={16}
          />{' '}
        </span>
      )

    case 'VK':
      return (
        <span
          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-[#0077ff]`}
        >
          <FaVk className="w-5 h-5 text-white" aria-hidden="true" />
        </span>
      )

    case 'Yandex':
      return (
        <span
          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-[#fc3f1d]`}
        >
          <FaYandex className="w-5 h-5 text-white" aria-hidden="true" />
        </span>
      )
  }
}

const Map: React.FC<{
  employements: {
    position: string
    company: Companies
    employedOn: string
  }[]
}> = ({ employements }) => {
  return (
    <Fragment>
      {employements.length !== 0 ? (
        <div className="mt-6 flow-root">
          <ul role="list" className="-mb-8">
            {employements.map((employement, employementIdx) => (
              <li key={employementIdx}>
                <div className="relative pb-8">
                  {employementIdx !== employements.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>{convertIcon(employement.company)}</div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <a href="#" className="font-medium text-gray-900 cursor-default">
                            {convertCompany(employement.company)}
                          </a>
                          {' · '}
                          {employement.position}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <div className="flex space-x-2">
                          <time dateTime={employement.employedOn}>
                            {format(new Date(employement.employedOn), 'MMM yyyy', { locale: ru })}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <h3 className="pt-4 text-sm text-gray-500">Не указан</h3>
      )}
    </Fragment>
  )
}

export default Map
