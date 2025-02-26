// import { currentUser } from '@clerk/nextjs';
import React from 'react'

const RightSidebar = async () => {
//   const user = await currentUser();
//   if (!user) return null;


//   const result = await fetchUsers({
//       userId : user.id,
//       searchString: '',
//       pageNumber : 1,
//       pageSize : 25,
//   })
  return (
    <section className='custom-scrollbar rightsidebar'>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className='text-heading4-medium text-light-1'>Advertisment Here</h3>
                
        <div className="mt-14 flex flex-col gap-9">
          
        </div>
            </div>
    </section>
  )
}

export default RightSidebar