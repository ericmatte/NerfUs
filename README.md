#NerfUS
<p><span style="font-size: 24px;">Jeu de tir, Projet S5</span></p>

<p>Pour installer le projet sur votre poste de travail, suivre les &eacute;tapes ci-dessous:</p>

<p><strong><span style="font-size: 18px;">1. Installation des logiciels</span></strong></p>

<p>Installer la derni&egrave;re version de <a href="https://www.python.org/downloads/" rel="noopener noreferrer" target="_blank">Python</a>.</p>

<p>Installer <a href="https://www.jetbrains.com/pycharm/download/#section=windows" rel="noopener noreferrer" target="_blank">Pycharm Professional</a> (disponible gratuitement avec l&#39;universit&eacute;).</p>

<p>
	<br>
</p>

<p><strong><span style="font-size: 18px;">2. Configuration de l&#39;environnement Python</span></strong></p>

<p>Dans Pycharm, ouvrir le projet sous <strong>Nerfus/api.</strong></p>

<p>Aller dans <strong>File-&gt;Settings-&gt;Poject:api-&gt;Project Interpreter.</strong></p>

<p>Cliquer sur le petit engrenage en haut &agrave; droite de la fen&egrave;tre, et choisir <strong>Create VirtualEnv.</strong></p>

<p>Nommer la virtualenv &quot;sw-flask-virtualenv&quot; et choisir l&#39;emplacement du dossier et appuyer sur <strong>Ok.</strong></p>

<p>Re-cliquer sur l&#39;engrenage et cliquer sur <strong>More...</strong>.</p>

<p>Changer ici aussi le nom de votre virtualenv &agrave; &quot;sw-flask-virtualenv&quot; en cliquant sur le crayon.</p>

<p>Fermer la fen&egrave;tre Settings en cliquant sur <strong>Ok.</strong></p>

<p>
	<br>
</p>

<p><span style="font-size: 18px;"><strong>3. Installer les packages Python</strong></span></p>

<p>Dans Pycharm, ouvrir le fichier du projet nomm&eacute; &quot;setup.py&quot;</p>

<p>En ouvrant ce fichier, Pycharm devrait vous avertir que des paquets sont manquant (<strong>Package requirements</strong>)</p>

<p>Cliquer sur <strong>Install requirements</strong>, puis attendre la fin de l&#39;installation des packages</p>

<p>
	<br>
</p>

<p><span style="font-size: 18px;"><strong>4. Configurer le d&eacute;marrage du serveur</strong></span></p>

<p>En haut &agrave; droite de Pycharm, vous devriez retrouver les configurations de d&eacute;marrage directement &agrave; gauche du bouton Play.</p>

<p>Cliquez sur <strong>Edit Configurations...</strong></p>

<p>Validez les champs ci-dessous:</p>

<table style="width: 41%; margin-right: calc(59%);">
	<tbody>
		<tr>
			<td style="width: 27.4949%;"><strong>Script</strong></td>
			<td style="width: 72.5051%;">Doit pointer vers le fichier <strong>run.py</strong></td>
		</tr>
		<tr>
			<td style="width: 27.4949%;"><strong>Projet Interpreter</strong></td>
			<td style="width: 72.5051%;">Votre virtualenv <strong>sw-flask-virtualenv</strong></td>
		</tr>
	</tbody>
</table>

<p>
	<br>
</p>

<p>Le serveur devrait maintenant fonctionner en appuyant sur <strong>Play.</strong></p>

<p>
	<br>
</p>

<p><span style="font-size: 18px;"><strong>5. Configurer les tests</strong></span></p>

<p>Ajouter une configuration de tests: <strong>+ -&gt; Python tests -&gt; py.test</strong></p>

<table style="width: 41%; margin-right: calc(59%);">
	<tbody>
		<tr>
			<td style="width: 26.593%;"><strong>Name</strong></td>
			<td style="width: 73.2033%;">Tests</td>
		</tr>
		<tr>
			<td style="width: 26.593%;"><strong>Target</strong></td>
			<td style="width: 73.2033%;">tests</td>
		</tr>
		<tr>
			<td style="width: 26.593%;"><strong>Keywords</strong></td>
			<td style="width: 73.2033%;"><strong>[Facultatif]&nbsp;</strong>Pour filtrer les tests</td>
		</tr>
	</tbody>
</table>
