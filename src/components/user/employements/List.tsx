import Map from '@/components/user/employements/Map'
import type { Companies } from '@prisma/client'

const List: React.FC<{
  employements: {
    position: string
    company: Companies
    employedOn: string
  }[]
}> = ({ employements }) => {
  return (
    <section aria-labelledby="timeline-title" className="lg:col-start-3 lg:col-span-1">
      <div className="bg-white border rounded-md border-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h2 id="timeline-title" className="text-lg font-medium leading-6 text-gray-900">
            Опыт работы
          </h2>
        </div>

        <div className="border-t px-4 pb-6 sm:px-6">
          <Map employements={employements} />
        </div>
      </div>
    </section>
  )
}

export default List
