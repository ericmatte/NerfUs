#NerfUS:&nbsp;A Shooting Range Game

<h3><span style="font-size: 24px;">S5 Project, Team P05</span></h3>

<p>Theses are the steps to run locally the server on your computer.</p>

<p>*<em>This guide may not be complete. Feel free to change any section for an easier configuration.</em></p>

<p>
	<br>
</p>

<p><strong><span style="font-size: 18px;">1. Download NerfUS</span></strong></p>

<p>Download the latest server app of NerfUS from this repo.</p>

<p>
	<br>
</p>

<p><strong><span style="font-size: 18px;">2. Installing Node.JS</span></strong></p>

<p>- Grab the latest <strong>LTS&nbsp;</strong>version of Node.JS from the web site <a href="https://nodejs.org/en/">https://nodejs.org/en/</a>.</p>

<p>- Run the installer</p>

<p>- Follow the steps</p>

<p>
	<br>
</p>

<p><span style="font-size: 18px;"><strong>3. Intalling Project Dependencies</strong></span></p>

<p>Open a <strong>CMD</strong> under the project folder<strong>&nbsp;./node-server</strong>.</p>

<p>In that folder, their is a file named package.json, which contains all the necessary dependencies for this project.</p>

<p>In your CMD, simply run this command:</p>

<blockquote>
	npm install
</blockquote>

<p>This will download all the dependencies from the package.json file.</p>

<p>
	<br>
</p>

<p><span style="font-size: 18px;"><strong>4. Installing and starting Bitvise tunneling</strong></span></p>

<p>Before running the server locally on your working station, you need to setup a tunnel to the real NerfUS server database.</p>

<p>This will allow you local server to fetch data from the database, and it&#39;s necessary for the server to be able to run.</p>

<p>Download &amp; install<strong>&nbsp;Bitvise Tunnelier&nbsp;</strong>here : <a href="https://www.bitvise.com/download-area">https://www.bitvise.com/download-area</a>.</p>

<p>Now, in the root folder of the project, their is a file named <strong>bitvise-tunnel.tlp</strong>.</p>

<p>Click on the file, and press login in Bitvise.</p>

<p>If the connection is successful, you can minimize this window.</p>

<p>*<em>Note that Bitvise must be running as long as you want to run the server locally.</em></p>

<p>
	<br>
</p>

<p><span style="font-size: 18px;"><strong>5. Start the server in debug mode</strong></span></p>

<p>Open<strong>&nbsp;two CMD terminals</strong> into the<strong>&nbsp;./node-server</strong> folder.</p>

<p>On the first on, run this:</p>

<blockquote>
	node-inspector
</blockquote>

<p>It will show you an local web address. This is the <strong>server-side debugging tool</strong>. Use chrome for better debugging.</p>

<p>On the second CMD, run this:</p>

<blockquote>
	nodemon --debug server.js
</blockquote>

<p>Nodemon will start the node server, and also listen for any changes in the code. When that happens, it will automatically restart the server.</p>

<p><em>While their is a lot of way to run a node-js server, really like this one, because it give you some powerful debugging features.</em></p>

<p>
	<br>
</p>

<p>That&#39;s all!</p>
