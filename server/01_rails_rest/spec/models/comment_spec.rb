require 'rails_helper'

RSpec.describe Comment, type: :model do

  let(:post) {
    Post.create!(title: 'a title', content: 'and some content')
  }

  subject { post.comments.new }

  it "create" do
    subject.update_attributes(content: 'and some content')
    expect(subject).to be_valid
  end

  it "validates" do
    expect(subject).to_not be_valid
  end

end
