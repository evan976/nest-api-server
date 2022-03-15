export const getNewCommentHtml = (
  title: string,
  content: string,
  name: string,
  site?: string
) => {
  return `
    <div style="color: #40485B; font-size: 14px; background-color: #f8f8f8;">
      <div style="width: 100%; max-width: 600px; padding: 20px; margin: 0 auto;">
        <div style="text-align: center;margin-bottom: 20px;">
          <img src="https://evanone.site/_nuxt/assets/images/logo.svg" height="30" alt="Logo black">
        </div>
        <div style="background: #fff; border: 1px solid #E3E9ED; margin-bottom: 10px;">
          <div style="font-size: 18px; line-height: 30px; padding: 10px 20px; background: #fcfcfc; border-bottom: 1px solid #E3E9ED;">博客评论通知</div>
          <div style="padding: 20px;line-height: 1.7;">
            <p>
              <a style="color: #FE7300; text-decoration: underline;" href="${
                site || '#'
              }">${name}</a>
              评论了你的博客Re: ${title}
            </p>
            <p>${content}</p>
          </div>
        </div>
        <div style="color: #9B9B9B; font-size: 12px; margin-top: 20px;">
          @evanone.site
        </div>
      </div>
    </div>
  `
}

export const getReplyCommentHtml = (
  name: string,
  oldConent: string,
  content: string,
  site?: string
) => {
  return `
    <div style="color: #40485B; font-size: 14px; background-color: #f8f8f8;">
      <div style="width: 100%; max-width: 600px; padding: 20px; margin: 0 auto;">
        <div style="text-align: center;margin-bottom: 20px;">
          <img src="https://evanone.site/_nuxt/assets/images/logo.svg" height="30" alt="Logo black">
        </div>
        <div style="background: #fff; border: 1px solid #E3E9ED; margin-bottom: 10px;">
          <div style="font-size: 18px; line-height: 30px; padding: 10px 20px; background: #fcfcfc; border-bottom: 1px solid #E3E9ED;">博客回复通知</div>
          <div style="padding: 20px;line-height: 1.7;">
            <p>
              <a style="color: #FE7300; text-decoration: underline;" href="${
                site || '#'
              }">${name}</a>
              回复了你的评论Re: ${oldConent}
            </p>
            <p>${content}</p>
          </div>
        </div>
        <div style="color: #9B9B9B; font-size: 12px; margin-top: 20px;">
          @evanone.site
        </div>
      </div>
    </div>
  `
}
