import React, { useEffect, useState } from 'react'
import "../../styles/BasicLinkStyle.css"
import LinkItem from '../Root/LinkItem'
import LinkModal from '../Root/LinkModal'
import { useAuth } from '../../context/AuthContext'
import { useLink } from '../../context/LinkContext'
import LoadingPage from '../Root/LoadingPage'
import SuccessAlert from '../Root/SuccessAlert'

// array of categories 
const categories = [
  'mutual-fund',
  'basic-forms',
  'most-common-links'
]

// array of links to render 
// const linksArray = [
//   {
//     "url": "https://Niveshonline.com",
//     "title": "Niveshonline link Website",
//     "category": "mutual-fund"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/oh5mb76304801e0ee4b8988a8fe4d99a10ee4",
//     "title": "Common Transaction Form New (1)",
//     "category": "mutual-fund"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/p90mwf6f08693fce74daab99af930ca3e820d",
//     "title": "Uti Change of bank IPV SINGLE",
//     "category": "mutual-fund"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/4ppzt3802a47fcebd4e309cd102a6063b2534",
//     "title": "AOF BSE NEW _26-6-23",
//     "category": "basic-forms"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/e7www57b37d59cf1f4305ab2f365a7b0b96e4",
//     "title": "Mandate Form New BSE_28-11-23",
//     "category": "basic-forms"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/4ppzt5adb9211686348ed8c9259ec55dce989",
//     "title": "FATCA BSE New form Non Individual 20-9-23",
//     "category": "basic-forms"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/oh5mb5234b03126ec409f8ea0945e2713989e",
//     "title": "Axis mf Change of bank details -Old Bank not Aval. Declaration Form_24-11-23",
//     "category": "basic-forms"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/oh5mbea8500e075e349b5abc83f21137933ae",
//     "title": "Axis mf folio merger form",
//     "category": "basic-forms"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/oh5mb2372a51d86e8402e8120fda3b2b6ffe7",
//     "title": "Bilra mf NON-FINANCIAL-Transaction-Form-Unclaime Red. form",
//     "category": "basic-forms"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/oh5mb2d5835d320f1455581ae8582b216af46",
//     "title": "CAMS for Consolidation of Folios",
//     "category": "basic-forms"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/oh5mb2a594d3a00ca48bdb3a6a1f1f7f546e8",
//     "title": "Canara mf change ofbank-without-existing-bank-proof-form_24-11-23",
//     "category": "basic-forms"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/oh5mb5745fa50d0624cc39690f93f83db41c0",
//     "title": "Canara mf folio merger form",
//     "category": "basic-forms"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/4ppzt071e566a9b46437dbeb160ec414ed35d",
//     "title": "UTI mf consolidation form",
//     "category": "most-common-links"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/4ppztef9d3f7cf5bf41e7b293b12c3a051aed",
//     "title": "UTI MF IPV SINGLE Form_OLD BANk not Avail. 12 -9-23",
//     "category": "most-common-links"
//   },
//   {
//     "url": "https://workdrive.zoho.com/file/4ppzt5f68d4af6a4e40a18e1e1cb9356dcce8",
//     "title": "UTI -Multiple bank account registration-ARN-37133",
//     "category": "most-common-links"
//   }
// ]

function BasicLink() {
  const [inputValue, setInputValue] = useState('');
  const [selectedLink, setSelectedLink] = useState({_id: '', title: '', url: '', category: ''});
  const { loggedIn, setLoggedIn, user, fetchUser } = useAuth();
  const { linkItems, setLinkItems, linksArray, getAllLinks, loading } = useLink()
  
  // modal configuration state 
  const [modalConfig, setModalConfig] = useState({open: false, heading: '', action: '', actionButton: '', disableCategory: false})
  
  // split words using '-' and convert to title case 
  const convertToTitleCase = (str) => {
    const words = str.split('-');

    const titleCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    const titleCaseString = titleCaseWords.join(' ');

    return titleCaseString;
  }

  const handleSearch = (e) => {
    let searchTerm = e.target.value.toLowerCase().trim();
    setInputValue(searchTerm);

    if (searchTerm === '') {
      setLinkItems(linksArray);
      return;
    }

    setLinkItems(
      linksArray.filter(item => (
        item.title.toLowerCase().includes(searchTerm)
      )
    ))
  }

  const openAddLinkModal = () => {
    setSelectedLink({_id: '', title: '', url: '', category: ''})
    setModalConfig({
      open: true,
      heading: 'Add new link',
      action: 'add',
      actionButton: 'Add',
      disableCategory: false
    })
  }

  const updateSelectedLink = (value) => {
    setSelectedLink(value);
  }

  // effect to fetch all links 
  useEffect(() => {
    getAllLinks();

  }, [])

  // effect to get user data 
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setLoggedIn(true);

      // fetch user data
      fetchUser(token);
    }

  }, [loggedIn])

  if(loading) {
    return <LoadingPage/>
  }

  return (
    <main className='basic-container'>
      <div className="basic-link-content">
        <div className="flex space-between items-center">
          <SuccessAlert/>
          <h2>Basic Links</h2> 
          {user?.role === 'admin' && 
            <>
            <button className='add-link-btn' onClick={openAddLinkModal}>Add Link</button>
            <LinkModal 
              isOpen={modalConfig.open} 
              onClose={() => setModalConfig(prevConfig => ({...prevConfig, open: false}))} 
              disableCategory={modalConfig.disableCategory}
              heading={modalConfig.heading}
              action={modalConfig.action}
              actionButton={modalConfig.actionButton}
              selectedLink={selectedLink} 
              updateSelectedLink={updateSelectedLink}
            />
            </>
          }
        </div>

        <p>Explore some important links:</p>

        {/* <!-- Search input field --> */}
        <div className="search-container">
          <input
            type="search"
            className="search-input"
            id="search-input"
            onChange={handleSearch}
            value={inputValue}
            placeholder="Search links..."
          />
        </div>

        <ul className="link-container" id="link-list"> {
          linkItems.length === 0 ?
            <li id="not-found">No link found!</li> :
            <>{categories.map(category => (
              <>
                <li className="category-header">{convertToTitleCase(category)}</li>
                <ol type='1'>{
                  linkItems.map(item => (
                    item.category === category 
                      ? <LinkItem 
                        key={item._id} 
                        data={item} 
                        updateSelectedLink={updateSelectedLink} 
                        setModalConfig={setModalConfig}
                        isAdmin={user?.role === 'admin'}
                      /> : <></>
                  ))
                }</ol>
              </>
            ))}</>

        }
        </ul>
      </div>

    </main>
  )
}

export default BasicLink