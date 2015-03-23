
set :css_dir, 'css'

set :js_dir, 'js'

set :images_dir, 'img'

ready do

  sprockets.append_path File.join root, 'bower_components'

end

configure :build do

  activate :minify_css

  activate :minify_javascript

end
