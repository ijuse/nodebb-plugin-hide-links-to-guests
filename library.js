"use strict";

const plugin = {};

// 定义屏蔽信息的常量
const HIDE_MESSAGE_LINK = '<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>';

plugin.alterContent = function (params, callback) {
  try {
    if (!params.uid) {
      params.posts.forEach((post) => {
        if (post && post.content) {
          // 屏蔽图片
          post.content = post.content.replace(/<img[^>]*>/g, HIDE_MESSAGE_LINK);

          // 屏蔽 <p><iframe>...</iframe></p>
          post.content = post.content.replace(
            /<p>\s*<iframe[^>]*>.*?<\/iframe>\s*<\/p>/g,
            HIDE_MESSAGE_LINK
          );

          // 屏蔽超链接，但保留标题中的 <a>
          post.content = post.content.replace(/<a\s+[^>]*>.*?<\/a>/g, (match) => {
            // 检查是否在 <h1>~<h6> 标签中
            const isInHeader = /<h[1-6][^>]*>.*?<\/h[1-6]>/s.test(post.content) && post.content.includes(match);
            return isInHeader ? match : HIDE_MESSAGE_LINK;
          });
        }
      });
    }

    // 确保最终调用 callback
    callback(null, params);
  } catch (err) {
    console.error("Error in alterContent:", err);
    callback(err);
  }
};

module.exports = plugin;
