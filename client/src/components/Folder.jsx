import React from 'react'
import FolderView from './elements/folder/FolderView'
import Folders from './elements/folder/Folders'
const Folder = () => {
  return (
     <div className="max-w-7xl mx-auto px-4 py-6">
      {/* <Folders />        */}
      <FolderView />   {/* renders the list with icons and titles */}
    </div>
  )
}

export default Folder
