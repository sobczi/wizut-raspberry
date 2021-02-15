deploy:
	rm -rf dist && npm run build -- --prod && cp -r dist/wizut-raspberry/* ../wizut-raspberry-build && cd ../wizut-raspberry-build && git add * && git commit -m "chore: auto build" && git push 
