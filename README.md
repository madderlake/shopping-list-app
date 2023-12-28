# Grocery Shopping List App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This project can be viewed here: [mah-shopping-list.netlify.app](https://mah-shopping-list.netlify.app/)

## Requested Features

✅ Fetch food data from api to populate "suggestions" list\
✅ Clicking on suggestion in the generated list adds the item to the shopping list\
✅ Grocery items can be deleted with an `X` button\
✅ Grocery item can be marked as completed using a checkbox
  
## Challenges Added

✅ Debounce api requests\
✅ Item quantity is editable, until checked\
✅ Grocery items can be dragged and dropped to re-order\
✅ Keyboard navigation with arrow keys, and Tab key\
✅ Voiceover works well but can always be enhanced - added `remove ${item}` as aria-label

## Todo's

- Improve keyboard (arrow key) navigation, add hook
- Make item text editable
- Ennhance Drag and Drop functionality to resemble a total replacement of the item, with animation and snap. Since items are all rerendered with each change, this would need to be accomplished via positioning and css animations.
- Dig deeper into accessibility.
- Add testing!!

## Thoughts

My approach to this was to keep the code as simple and "from scratch" as possible, though it is amazing how complex a simple app like this can get. Typescript adds complexity but the rewards are well worth it in my opinion and I never develop without it after years of resisting it 🥹.

I installed no external libraries, though I can't say I wasn't tempted 😉 I was most surprised by how tricky keyboard navigation with arrow keys is, and would definitely like to take a deeper dive into that - maybe add a hook. If this was going to production, I would tighten up the drag 'n drop functionality to make it more clear that an item is being inserted / replaced.

In the interests of time, I'm submitting this as a WIP, but with all challenges addressed!
