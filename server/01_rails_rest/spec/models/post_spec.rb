require 'rails_helper'

RSpec.describe Post, type: :model do
  subject { described_class.new }

  it "create" do
    subject.update_attributes(title: 'a title', content: 'and some content')
    expect(subject).to be_valid
  end

  it "validates" do
    expect(subject).to_not be_valid
  end
end
