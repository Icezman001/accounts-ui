const initialState = { isOpen: false }

export function confirm(state = initialState, action) {
  switch (action.type) {
    case 'NEW_CONFIRM':
      return { isOpen: true, ...action.data }
    case 'REMOVE_CONFIRM_TRUE':
      return { isOpen: false, result: true }
    case 'REMOVE_CONFIRM_FALSE':
      return { isOpen: false, result: false }
    default:
      return state
  }
}

export function newConfirm(data) {
  if (!data.prompt) {
    console.error('cannot confirm without a prompt')
  }
  return (dispatch, getState) => {
    dispatch({
      type: 'NEW_CONFIRM',
      data
    })
    return new Promise(res => {
      res(getState().confirm.result === true)
    })
  }
}