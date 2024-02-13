const { body, validationResult } = require('express-validator')
const authenticate = require('../Middleware/authenticate')
const LinkModel = require('../Models/LinkModel')
const isAdmin = require('../Middleware/isAdmin')

const router = require('express').Router()

router.post('/insertmany', async (req, res) => {
  const docs = req.body.links;
  const insertedDocs = await LinkModel.insertMany(docs);
  res.status(200).json({message: 'inserted', insertedDocs})
})
//@description     Add new link
//@route           POST /api/link/
//@access          Protected + Admin
router.post('/', [
  body('title', "Title of link must of minimum 3 characters").isLength({min: 3}),
  body('url', "URL is not valid").isURL({protocols: ['https']})
], authenticate, isAdmin, async (req, res) => {
  const {title, url, category} = req.body;

  // check for validation errors 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({error: errors.array()});
  }

  try {
    // create and save the new Link doc 
    const newLink = await LinkModel.create({
      title,
      url,
      category
    })

    if (!newLink) {
      console.error('Unable to create new link document');
      return res.status(501).json({ error: 'Unable to add the link' });
    }

    // return the saved new link
    res.status(200).json({message: 'Link added', link: newLink});
    
  } catch (error) {
    if (error) {
      console.error('Error adding new link: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
})


//@description     Get a link by id
//@route           GET /api/link/id
//@access          Protected + Admin
router.get('/:id', authenticate, isAdmin, async (req, res) => {
  const linkId = req.params.id;

  try {
    // find link using id
    const link = await LinkModel.findById(linkId);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // return the link
    res.status(200).json({link});
    
  } catch (error) {
    if (error) {
      console.error('Error getting link by id: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
})


//@description     Get all links
//@route           GET /api/link
//@access          Protected
router.get('/', authenticate, async (req, res) => {

  try {
    // find all links
    const links = await LinkModel.find();

    if (!links) {
      return res.status(404).json({ error: 'Links not found' });
    }

    // return all the links
    res.status(200).json({links});
    
  } catch (error) {
    if (error) {
      console.error('Error getting links: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
})


//@description     Update a link
//@route           UPDATE /api/link/linkID
//@access          Protected + Admin
router.put('/:id', [
  body('title', "Title of link must of minimum 3 characters").optional().isLength({min: 3}),
  body('url', "URL is not valid").optional().isURL({protocols: ['https']})
], authenticate, isAdmin, async (req, res) => {
  const linkId = req.params.id;
  
  // check for validation errors 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({error: errors.array()});
  }
  
  const updateFields = {};

  // add title to updateFields if present 
  if(req.body.title){
    updateFields.title = req.body.title;
  }

  // add url to updateFields if present 
  if(req.body.url){
    updateFields.url = req.body.url;
  }

  try {
    // find the link 
    const link = await LinkModel.findByIdAndUpdate(linkId, updateFields, {new: true});

    if (!link) {
      return res.status(400).json({ error: 'Unable to update' });
    }

    // return the saved new link
    res.status(200).json({message: 'Link updated', link});
    
  } catch (error) {
    if (error) {
      console.error('Error updating link: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
})


//@description     Delete a link
//@route           DELETE /api/link/linkID
//@access          Protected + Admin
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  const linkId = req.params.id;

  try {
    // find and delete the link 
    const deletedLink = await LinkModel.findByIdAndDelete(linkId);

    if (!deletedLink) {
      return res.status(501).json({ error: 'Unable to delete the link' });
    }

    // return the saved new link
    res.status(200).json({message: 'Link deleted', link: deletedLink});
    
  } catch (error) {
    if (error) {
      console.error('Error deleting link: ', error)
      res.status(500).json({ error: 'Server error' })
    }
  }
})

module.exports = router;