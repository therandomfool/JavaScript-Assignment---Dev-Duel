/* eslint-disable no-undef */
$('form').submit(() => {
  const username = $('form input').val()
  console.log(`examining ${username}`)

  // Fetch data for given user
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USER_URL}/${username}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(data => {
      console.log(`Got data for ${username}`)
      console.log(data)

      $('span.label').attr('id', 'forceMajeure')
      $('#forceMajeure.label').css({
        'font-size': '30px',
        'color': 'red',
        'font-weight': '800',
        'justify-content': 'flex-start'
      })
      $('span.value').css({
        'font-size': '30px',
        'color': 'blue',
        'font-weight': '800',
        'text-align': 'center'
      })

      $('div.stat').addClass('manipulation')
      $('.manipulation').css({
        'margin': '20px 30px 0 30px',
        'padding': '5px',
        'border': '3px solid goldenrod',
        'border-radius': '7px',
        'background': '	#c6c6c6'
      })



      $('.username').html(data.username)
      $('.full-name').html(data.name)
      $('.location').html(data.location)
      $('.email').html(data.email)
      $('.bio').html(data.bio)
      $('.avatar').attr("src", data.avatar_url)

      $('.titles').html(JSON.stringify(data.titles))
      let titlesString = ''
      if (data.titles.length < 1) {
        $('.titles').html(`User has no titles`)
      } else {
        for (let x = 0; x < data.titles.length; x++) {
          titlesString += `${data.titles[x]}` + "<br>"
        }
        $('.titles').html(titlesString)
        console.log(titlesString)
      }

      if (data.favorite_language === null) {
        $('.favorite-language').html("N U L L")
      } else {
        $('.favorite-language').html(data.favorite_language)
      }
      // $('.total-stars').html(data.total_stars)
      $('.most-starred').html(data.highest_starred)

      $('.public-repos').html(data.public_repos)
      $('.perfect-repos').html(data.perfect_repos)
      $('.followers').html(data.followers)
      $('.following').html(data.following)






      $('.user-results').removeClass('hide') // Display '.user-results' element
    })
    .catch(err => {
      console.log(`Error getting data for ${username}`)
      console.log(err)
      /*
        TODO
        If there is an error finding the user, instead toggle the display of the '.user-error' element
        and populate it's inner span '.error' element with an appropriate error message
      */
    })

  return false // return false to prevent default form submission
})