require 'rails_helper'

RSpec.describe "Comments", type: :request do
  let(:post) {
    Post.create!(title: 'a title', content: 'and some content')
  }
  describe "GET /comments" do
    it "works! (now write some real specs)" do
      get post_comments_path(post.id)
      expect(response).to have_http_status(200)
    end
  end
end
